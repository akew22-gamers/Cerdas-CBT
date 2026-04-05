import { getSession } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { SiswaClient } from '@/components/siswa/SiswaClient'

interface Kelas {
  id: string
  nama_kelas: string
}

interface Siswa {
  id: string
  nisn: string
  nama: string
  kelas: {
    id: string
    nama_kelas: string
  } | null
}

export default async function SiswaListPage({
  searchParams,
}: {
  searchParams: Promise<{ kelas_id?: string }>
}) {
  const session = await getSession()
  const resolvedParams = await searchParams
  const kelas_id = resolvedParams.kelas_id

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'guru') {
    redirect('/login')
  }

  const supabase = createAdminClient()

  const { data: kelasList } = await supabase
    .from('kelas')
    .select('id, nama_kelas')
    .eq('created_by', session.user.id)
    .order('nama_kelas', { ascending: true })

  let query = supabase
    .from('siswa')
    .select(`
      *,
      kelas:kelas_id (
        id,
        nama_kelas
      )
    `)
    .eq('created_by', session.user.id)

  if (kelas_id) {
    query = query.eq('kelas_id', kelas_id)
  }

  const { data: siswaList } = await query.order('nama', { ascending: true })

  return (
    <DashboardLayout
      user={{
        nama: session.user.nama || 'Guru',
        username: session.user.username,
        role: 'guru'
      }}
    >
      <SiswaClient
        siswaList={siswaList || []}
        kelasList={kelasList || []}
      />
    </DashboardLayout>
  )
}