import { NextResponse } from 'next/server'
import type { ApiSuccessResponse, ApiErrorResponse } from '@/types/api'
import { getSession } from '@/lib/auth/session'
import { logAudit } from '@/lib/utils/audit'

export async function POST() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json<ApiErrorResponse>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Tidak terautentikasi'
        }
      }, { status: 401 })
    }

    if (session.user.role !== 'super_admin') {
      return NextResponse.json<ApiErrorResponse>({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Hanya super admin yang dapat mereset data'
        }
      }, { status: 403 })
    }

    const { createAdminClient } = await import('@/lib/supabase/admin')
    const supabase = createAdminClient()

    const tablesToDelete = [
      'jawaban_siswa',
      'hasil_ujian',
      'anti_cheating_log',
      'soal',
      'ujian_kelas',
      'ujian',
      'siswa',
      'kelas',
    ]

    const deletedCounts: Record<string, number> = {}

    for (const table of tablesToDelete) {
      const { count, error } = await supabase
        .from(table)
        .delete({ count: 'exact' })
        .neq('id', '00000000-0000-0000-0000-000000000000')

      if (error) {
        console.error(`Error deleting ${table}:`, error)
      }

      deletedCounts[table] = count || 0
    }

    await logAudit({
      userId: session.user.id,
      role: 'super_admin',
      action: 'reset_data',
      entityType: 'system',
      details: {
        deleted_counts: deletedCounts
      }
    })

    return NextResponse.json<ApiSuccessResponse<{
      message: string
      deleted_counts: Record<string, number>
    }>>({
      success: true,
      data: {
        message: 'Data berhasil di-reset',
        deleted_counts: deletedCounts
      }
    })
  } catch (error) {
    console.error('Reset data error:', error)
    return NextResponse.json<ApiErrorResponse>({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Gagal mereset data'
      }
    }, { status: 500 })
  }
}