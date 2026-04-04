import { NextResponse, type NextRequest } from 'next/server'

const SESSION_COOKIE_NAME = 'cbt_session_token'
const SESSION_CLAIMS_COOKIE_NAME = 'cbt_session_claims'

function getSessionSecret(): string {
  return process.env.SESSION_SECRET || process.env.SETUP_TOKEN || 'fallback-secret-change-me'
}

/**
 * Decode base64url string (Web Crypto compatible, no Buffer needed)
 */
function base64urlDecode(str: string): string {
  // Convert base64url → base64
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  // Pad if needed
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
  return atob(padded)
}

/**
 * Verifikasi claims cookie menggunakan Web Crypto API (Edge Runtime compatible).
 * Tidak menyentuh database — hanya HMAC verification lokal (~0.1ms).
 * Returns null jika gagal — middleware akan fallback ke session-token-only check.
 */
async function verifyClaimsFast(
  claims: string
): Promise<{ role: string; uid: string } | null> {
  try {
    const dotIndex = claims.lastIndexOf('.')
    if (dotIndex === -1) return null

    const data = claims.slice(0, dotIndex)
    const sig = claims.slice(dotIndex + 1)
    if (!data || !sig) return null

    const secret = getSessionSecret()
    const encoder = new TextEncoder()

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    // Decode base64url signature to bytes
    const sigBinary = base64urlDecode(sig)
    const sigBytes = new Uint8Array(sigBinary.length)
    for (let i = 0; i < sigBinary.length; i++) {
      sigBytes[i] = sigBinary.charCodeAt(i)
    }

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      encoder.encode(data)
    )

    if (!isValid) return null

    const payload = JSON.parse(base64urlDecode(data))
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null
    if (!payload.role || !payload.uid) return null

    return { role: payload.role, uid: payload.uid }
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const claimsCookie = request.cookies.get(SESSION_CLAIMS_COOKIE_NAME)?.value

  // Autentikasi: cukup cek session token ada (backward compatible dengan sesi lama)
  // Server Components akan melakukan full DB validation via getSession()
  const isAuthenticated = !!sessionToken

  // Fast role check via claims cookie jika tersedia
  let sessionClaims: { role: string; uid: string } | null = null
  if (sessionToken && claimsCookie) {
    sessionClaims = await verifyClaimsFast(claimsCookie)
  }

  const protectedRoutes = ['/dashboard', '/ujian', '/admin', '/guru', '/siswa']
  const publicRoutes = ['/login', '/register']
  const rootRoute = '/'

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )
  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname === route
  )
  const isRootRoute = request.nextUrl.pathname === rootRoute

  if (isProtectedRoute && !isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Role-based routing — hanya jika claims tersedia dan valid
  if (isAuthenticated && sessionClaims) {
    const role = sessionClaims.role
    const path = request.nextUrl.pathname

    if (role === 'super_admin' && (path.startsWith('/guru') || path.startsWith('/siswa'))) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }

    if (role === 'guru' && path.startsWith('/admin')) {
      const url = request.nextUrl.clone()
      url.pathname = '/guru'
      return NextResponse.redirect(url)
    }

    if (role === 'siswa' && (path.startsWith('/admin') || path.startsWith('/guru'))) {
      const url = request.nextUrl.clone()
      url.pathname = '/siswa'
      return NextResponse.redirect(url)
    }
  }

  // Redirect dari public route ke dashboard jika sudah login
  if ((isPublicRoute || isRootRoute) && isAuthenticated) {
    const url = request.nextUrl.clone()

    if (sessionClaims) {
      const roleRedirectMap: Record<string, string> = {
        super_admin: '/admin',
        guru: '/guru',
        siswa: '/siswa'
      }
      url.pathname = roleRedirectMap[sessionClaims.role] || '/admin'
    } else {
      // Tidak ada claims → fallback ke /admin, Server Component akan redirect sesuai role
      url.pathname = '/admin'
    }
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}