import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SESSION_COOKIE_NAME = 'cbt_session_token'
const TOKEN_REFRESH_THRESHOLD = parseInt(process.env.TOKEN_REFRESH_THRESHOLD || '3600', 10)
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function getSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return null
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const tokenHash = await hashToken(token)

    const { data: session, error } = await supabase
      .from('sessions')
      .select('id, user_id, role, expires_at')
      .eq('token_hash', tokenHash)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !session) {
      return null
    }

    return session
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const session = await getSession(request)

  if (session && session.expires_at) {
    const expiresAt = new Date(session.expires_at).getTime() / 1000
    const now = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = expiresAt - now

    if (timeUntilExpiry <= TOKEN_REFRESH_THRESHOLD && timeUntilExpiry > 0) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !serviceRoleKey) {
          return response
        }

        const supabase = createClient(supabaseUrl, serviceRoleKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        })

        const token = request.cookies.get(SESSION_COOKIE_NAME)?.value

        if (token) {
          const tokenHash = await hashToken(token)
          const newExpiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000)

          await supabase
            .from('sessions')
            .update({ expires_at: newExpiresAt.toISOString(), updated_at: new Date().toISOString() })
            .eq('token_hash', tokenHash)

          response.cookies.set(SESSION_COOKIE_NAME, token, {
            path: '/',
            maxAge: SESSION_DURATION_SECONDS,
            sameSite: 'lax',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
          })
        }
      } catch {
        // Ignore refresh errors
      }
    }
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

  if (isProtectedRoute && !session) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Role-based route protection
  if (session) {
    const role = session.role
    const path = request.nextUrl.pathname

    // Super admin can only access /admin
    if (role === 'super_admin' && (path.startsWith('/guru') || path.startsWith('/siswa'))) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }

    // Guru can only access /guru
    if (role === 'guru' && path.startsWith('/admin')) {
      const url = request.nextUrl.clone()
      url.pathname = '/guru'
      return NextResponse.redirect(url)
    }

    // Siswa can only access /siswa
    if (role === 'siswa' && (path.startsWith('/admin') || path.startsWith('/guru'))) {
      const url = request.nextUrl.clone()
      url.pathname = '/siswa'
      return NextResponse.redirect(url)
    }
  }

  if ((isPublicRoute || isRootRoute) && session) {
    const url = request.nextUrl.clone()
    const roleRedirectMap: Record<string, string> = {
      super_admin: '/admin',
      guru: '/guru',
      siswa: '/siswa'
    }
    url.pathname = roleRedirectMap[session.role] || '/admin'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}