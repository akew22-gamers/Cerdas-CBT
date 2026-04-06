import { getSession } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Tidak terautentikasi' } },
        { status: 401 }
      )
    }

    const supabase = createAdminClient()
    const { filePath, folder = 'soal-images' } = await request.json()

    if (!filePath) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_FILE_PATH', message: 'File path tidak ditemukan' } },
        { status: 400 }
      )
    }

    const { error } = await supabase.storage
      .from(folder)
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json(
        { success: false, error: { code: 'DELETE_ERROR', message: error.message } },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'File berhasil dihapus'
    })

  } catch (error) {
    console.error('File delete error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan pada server' } },
      { status: 500 }
    )
  }
}
