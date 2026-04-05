import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { createSession, SESSION_COOKIE_NAME, SESSION_CLAIMS_COOKIE_NAME, SESSION_DURATION_SECONDS, signClaims } from '@/lib/auth/session'

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { ujian_id, siswa_id, kode_ujian } = body

    if (!ujian_id || !siswa_id || !kode_ujian) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_FIELDS', message: 'Data QR Code tidak lengkap' } },
        { status: 400 }
      )
    }

    const { data: siswa, error: siswaError } = await supabase
      .from('siswa')
      .select('*')
      .eq('id', siswa_id)
      .single()

    if (siswaError || !siswa) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Siswa tidak ditemukan' } },
        { status: 401 }
      )
    }

    const { data: ujian, error: ujianError } = await supabase
      .from('ujian')
      .select('*')
      .eq('kode_ujian', kode_ujian)
      .eq('id', ujian_id)
      .single()

    if (ujianError || !ujian) {
      return NextResponse.json(
        { success: false, error: { code: 'EXAM_NOT_FOUND', message: 'Kode ujian tidak ditemukan' } },
        { status: 404 }
      )
    }

    if (!siswa.kelas_id) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_ENROLLED', message: 'Siswa tidak terdaftar di kelas manapun' } },
        { status: 403 }
      )
    }

    const { data: ujianKelas, error: ujianKelasError } = await supabase
      .from('ujian_kelas')
      .select('id')
      .eq('ujian_id', ujian.id)
      .eq('kelas_id', siswa.kelas_id)
      .single()

    if (ujianKelasError || !ujianKelas) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_ENROLLED', message: 'Kelas Anda tidak terdaftar untuk ujian ini' } },
        { status: 403 }
      )
    }

    const session = await createSession(
      siswa.id,
      'siswa',
      siswa.nisn,
      siswa.nama || null
    )

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION_SECONDS,
      path: '/'
    })

    const claimsPayload = {
      role: 'siswa',
      uid: siswa.id,
      username: siswa.nisn,
      nama: siswa.nama || null,
      exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS
    }
    cookieStore.set(SESSION_CLAIMS_COOKIE_NAME, signClaims(claimsPayload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION_SECONDS,
      path: '/'
    })

    await supabase.from('audit_log').insert({
      user_id: siswa.id,
      role: 'siswa',
      action: 'login',
      entity_type: 'user',
      entity_id: siswa.id,
      details: { login_method: 'qr_scanner', ujian_id: ujian.id, kode_ujian: kode_ujian }
    })

    const redirectUrl = `/siswa/ujian/${ujian.id}`

    return NextResponse.json({
      success: true,
      data: {
        siswa_id: siswa.id,
        ujian_id: ujian.id,
        redirect_url: redirectUrl
      }
    })

  } catch (error) {
    console.error('QR Login error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan pada server' } },
      { status: 500 }
    )
  }
}
