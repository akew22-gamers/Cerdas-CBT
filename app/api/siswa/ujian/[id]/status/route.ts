import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Tidak terautentikasi' } },
        { status: 401 }
      )
    }

    const { id: ujianId } = await params

    const { data: hasil, error: hasilError } = await supabase
      .from('hasil_ujian')
      .select(`
        id,
        is_submitted,
        waktu_mulai,
        tab_switch_count,
        fullscreen_exit_count,
        ujian!inner (
          durasi
        )
      `)
      .eq('siswa_id', user.id)
      .eq('ujian_id', ujianId)
      .single()

    if (hasilError || !hasil) {
      return NextResponse.json(
        { success: false, error: { code: 'EXAM_NOT_STARTED', message: 'Ujian belum dimulai' } },
        { status: 400 }
      )
    }

    const ujian = hasil.ujian as any
    const durasiMs = (Array.isArray(ujian) ? (ujian[0]?.durasi ?? 60) : (ujian?.durasi ?? 60)) * 60 * 1000
    const waktuMulai = new Date(hasil.waktu_mulai).getTime()
    const now = Date.now()
    const elapsed = now - waktuMulai
    const remaining = Math.max(0, durasiMs - elapsed)

    const isFinished = remaining <= 0 || hasil.is_submitted

    const { data: jawabanCount } = await supabase
      .from('jawaban_siswa')
      .select('id', { count: 'exact' })
      .eq('siswa_id', user.id)
      .eq('ujian_id', ujianId)

    const { data: soalCount } = await supabase
      .from('soal')
      .select('id', { count: 'exact' })
      .eq('ujian_id', ujianId)

    return NextResponse.json({
      success: true,
      data: {
        is_submitted: hasil.is_submitted,
        is_finished: isFinished,
        time_remaining_ms: remaining,
        time_remaining_seconds: Math.floor(remaining / 1000),
        answered_count: jawabanCount?.length || 0,
        total_questions: soalCount?.length || 0,
        tab_switch_count: hasil.tab_switch_count,
        fullscreen_exit_count: hasil.fullscreen_exit_count
      }
    })

  } catch (error: any) {
    console.error('Get status error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan pada server' } },
      { status: 500 }
    )
  }
}
