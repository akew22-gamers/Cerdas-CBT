import { getSession } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { KartuUjianData, QRCardData } from '@/types/kartu'

async function convertLogoToBase64(logoUrl: string | null): Promise<string | null> {
  if (!logoUrl) return null
  if (logoUrl.startsWith('data:')) return logoUrl
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  process.env.NEXT_PUBLIC_APP_URL || 
                  'http://localhost:3000'
  const fullUrl = logoUrl.startsWith('/') 
    ? `${baseUrl}${logoUrl}`
    : logoUrl
  
  try {
    const response = await fetch(fullUrl)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const blob = await response.blob()
    const buffer = await blob.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const mimeType = response.headers.get('content-type') || 'image/svg+xml'
    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.error('Failed to convert logo:', error)
    return null
  }
}

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
    const { id } = await params

    const { data: ujian, error: ujianError } = await supabase
      .from('ujian')
      .select('id, kode_ujian, judul, durasi')
      .eq('id', id)
      .eq('created_by', session.user.id)
      .single()

    if (ujianError || !ujian) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Ujian tidak ditemukan' } },
        { status: 404 }
      )
    }

    const { data: ujianKelasData, error: ujianKelasError } = await supabase
      .from('ujian_kelas')
      .select('kelas_id')
      .eq('ujian_id', id)

    if (ujianKelasError || !ujianKelasData || ujianKelasData.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    const kelasIds = ujianKelasData.map(uk => uk.kelas_id)

    const { data: siswaData, error: siswaError } = await supabase
      .from('siswa')
      .select(`
        id,
        nisn,
        nama,
        kelas_id,
        kelas:kelas(id, nama_kelas)
      `)
      .in('kelas_id', kelasIds)
      .order('nisn', { ascending: true })

    if (siswaError) {
      console.error('Error fetching siswa:', siswaError)
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: 'Gagal mengambil data siswa' } },
        { status: 500 }
      )
    }

    const { data: sekolahData, error: sekolahError } = await supabase
      .from('identitas_sekolah')
      .select('nama_sekolah, logo_url')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (sekolahError) {
      console.error('Error fetching school info:', sekolahError)
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: 'Gagal mengambil data sekolah' } },
        { status: 500 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
    const logoDataUrl = await convertLogoToBase64(sekolahData?.logo_url || null)
    const kartuData: KartuUjianData[] = []

    for (const siswa of siswaData || []) {
      const qrCardData: QRCardData = {
        type: 'exam_login',
        u: ujian.id,
        s: siswa.id,
        k: ujian.kode_ujian,
        v: 1
      }

      const loginUrl = `${baseUrl}/ujian?u=${ujian.id}&s=${siswa.id}&k=${ujian.kode_ujian}`
      const kelasData = Array.isArray(siswa.kelas) ? siswa.kelas[0] : siswa.kelas

      kartuData.push({
        siswa: {
          id: siswa.id,
          nisn: siswa.nisn,
          nama: siswa.nama,
          kelas: kelasData ? {
            id: kelasData.id,
            nama_kelas: kelasData.nama_kelas
          } : null
        },
        ujian: {
          id: ujian.id,
          kode_ujian: ujian.kode_ujian,
          judul: ujian.judul,
          durasi: ujian.durasi
        },
        sekolah: {
          nama_sekolah: sekolahData?.nama_sekolah || '',
          logo_url: logoDataUrl
        },
        qrData: JSON.stringify(qrCardData),
        loginUrl
      })
    }

    return NextResponse.json({
      success: true,
      data: kartuData
    })

  } catch (error) {
    console.error('Get kartu ujian error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan pada server' } },
      { status: 500 }
    )
  }
}
