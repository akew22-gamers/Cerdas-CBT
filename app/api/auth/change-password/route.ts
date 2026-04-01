import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSession } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Tidak terautentikasi' } },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { old_password, new_password } = body

    if (!old_password || !new_password) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_FIELDS', message: 'Password lama dan baru harus diisi' } },
        { status: 400 }
      )
    }

    if (new_password.length < 6) {
      return NextResponse.json(
        { success: false, error: { code: 'PASSWORD_TOO_SHORT', message: 'Password baru minimal 6 karakter' } },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const { user } = session

    let tableName = ''
    switch (user.role) {
      case 'super_admin':
        tableName = 'super_admin'
        break
      case 'guru':
        tableName = 'guru'
        break
      case 'siswa':
        tableName = 'siswa'
        break
      default:
        return NextResponse.json(
          { success: false, error: { code: 'INVALID_ROLE', message: 'Role tidak valid' } },
          { status: 400 }
        )
    }

    const { data: userData, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', user.id)
      .single()

    if (error || !userData) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User tidak ditemukan' } },
        { status: 404 }
      )
    }

    const isValidPassword = await bcrypt.compare(old_password, userData.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_PASSWORD', message: 'Password lama salah' } },
        { status: 401 }
      )
    }

    const newPasswordHash = await bcrypt.hash(new_password, 10)

    const { error: updateError } = await supabase
      .from(tableName)
      .update({ password_hash: newPasswordHash, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (updateError) {
      return NextResponse.json(
        { success: false, error: { code: 'UPDATE_FAILED', message: 'Gagal mengupdate password' } },
        { status: 500 }
      )
    }

    await supabase.from('audit_log').insert({
      user_id: user.id,
      role: user.role,
      action: 'change_password',
      entity_type: 'user',
      entity_id: user.id,
      details: { method: 'self_update' }
    })

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diubah'
    })

  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan pada server' } },
      { status: 500 }
    )
  }
}