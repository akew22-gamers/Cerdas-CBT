import { getSession } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id: hasilId } = await params

    const { data: hasil, error: hasilError } = await supabase
      .from('hasil_ujian')
      .select(`
        id,
        nilai,
        jumlah_benar,
        jumlah_salah,
        waktu_mulai,
        waktu_selesai,
        is_submitted,
        tab_switch_count,
        fullscreen_exit_count,
        siswa:siswa_id (
          id,
          nisn,
          nama
        ),
        ujian:ujian_id (
          id,
          judul,
          show_result,
          durasi
        )
      `)
      .eq('id', hasilId)
      .single()

    if (hasilError || !hasil) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Hasil ujian tidak ditemukan' } },
        { status: 404 }
      )
    }

    const ujian = Array.isArray(hasil.ujian) ? hasil.ujian[0] : hasil.ujian
    const siswa = Array.isArray(hasil.siswa) ? hasil.siswa[0] : hasil.siswa

    if (!ujian) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_DATA', message: 'Data ujian tidak valid' } },
        { status: 500 }
      )
    }

    const { count: totalSoal } = await supabase
      .from('soal')
      .select('*', { count: 'exact', head: true })
      .eq('ujian_id', (ujian as any).id)

    return NextResponse.json({
      success: true,
      data: {
        id: hasil.id,
        siswa: {
          nisn: (siswa as any)?.nisn || '-',
          nama: (siswa as any)?.nama || '-'
        },
        ujian_id: (ujian as any).id,
        ujian_judul: (ujian as any).judul,
        durasi: (ujian as any).durasi,
        nilai: Math.round(hasil.nilai * 100) / 100,
        jumlah_benar: hasil.jumlah_benar,
        jumlah_salah: hasil.jumlah_salah,
        total_soal: totalSoal || 0,
        waktu_mulai: hasil.waktu_mulai,
        waktu_selesai: hasil.waktu_selesai,
        tab_switch_count: hasil.tab_switch_count || 0,
        fullscreen_exit_count: hasil.fullscreen_exit_count || 0,
        is_submitted: hasil.is_submitted
      }
    })

  } catch (error) {
    console.error('Get hasil detail error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan pada server' } },
      { status: 500 }
    )
  }
}