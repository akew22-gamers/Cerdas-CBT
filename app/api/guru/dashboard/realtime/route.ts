import { getSession } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Tidak terautentikasi' } },
        { status: 401 }
      )
    }

    if (session.user.role !== 'guru') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Akses ditolak' } },
        { status: 403 }
      )
    }

    const supabase = createAdminClient()

    const { data: activeUjian } = await supabase
      .from('ujian')
      .select(`
        id,
        judul,
        status,
        ujian_kelas!inner(
          kelas_id
        )
      `)
      .eq('created_by', session.user.id)
      .eq('status', 'aktif')

    if (!activeUjian) {
      return NextResponse.json({
        success: true,
        data: {
          subscriptions: [],
          sessionCounts: []
        }
      })
    }

    const sessionCounts: Array<{ ujian_id: string; count: number }> = []

    for (const ujian of activeUjian) {
      const { count } = await supabase
        .from('hasil_ujian')
        .select('*', { count: 'exact', head: true })
        .eq('ujian_id', ujian.id)
        .eq('is_submitted', false)

      sessionCounts.push({
        ujian_id: ujian.id,
        count: count || 0
      })
    }

    const subscriptions = activeUjian.map((u: any) => ({
      ujian_id: u.id,
      judul: u.judul,
      status: u.status
    }))

    return NextResponse.json({
      success: true,
      data: {
        subscriptions,
        sessionCounts
      }
    })

  } catch (error: any) {
    console.error('Error in GET /api/guru/dashboard/realtime:', error)
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan pada server' } },
      { status: 500 }
    )
  }
}
