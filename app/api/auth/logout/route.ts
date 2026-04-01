import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { SESSION_COOKIE_NAME } from '@/lib/auth/session'
import { createHash } from 'crypto'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (token) {
      const supabase = createAdminClient()
      const tokenHash = createHash('sha256').update(token).digest('hex')
      await supabase.from('sessions').delete().eq('token_hash', tokenHash)
    }

    cookieStore.delete(SESSION_COOKIE_NAME)

    return NextResponse.json({
      success: true,
      message: 'Logout berhasil'
    })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan pada server' } },
      { status: 500 }
    )
  }
}