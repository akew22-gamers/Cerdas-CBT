import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS } from '@/lib/auth/session'
import { createHash } from 'crypto'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: 'NO_SESSION', message: 'Tidak ada session aktif' } },
        { status: 401 }
      )
    }

    const supabase = createAdminClient()
    const tokenHash = createHash('sha256').update(token).digest('hex')
    const newExpiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000)

    const { error } = await supabase
      .from('sessions')
      .update({ expires_at: newExpiresAt.toISOString(), updated_at: new Date().toISOString() })
      .eq('token_hash', tokenHash)

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'REFRESH_FAILED', message: 'Gagal memperbarui session' } },
        { status: 500 }
      )
    }

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION_SECONDS,
      path: '/'
    })

    return NextResponse.json({
      success: true,
      data: {
        expires_at: newExpiresAt.toISOString(),
        refreshed_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Refresh token error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan pada server' } },
      { status: 500 }
    )
  }
}