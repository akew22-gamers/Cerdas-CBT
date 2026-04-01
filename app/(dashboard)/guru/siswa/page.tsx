import { getSession } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { SiswaTable } from '@/components/siswa/SiswaTable'
import { AddSiswaDialog } from '@/components/siswa/AddSiswaDialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Upload, GraduationCap, Users, Filter } from 'lucide-react'
import Link from 'next/link'

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
  const { kelas_id } = await searchParams

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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/25">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Manajemen Siswa</h1>
              <p className="text-slate-500 mt-0.5">Kelola data siswa dan kelas Anda</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 hover:bg-slate-50">
              <Upload className="h-4 w-4" />
              Import Excel
            </Button>
            <AddSiswaDialog />
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Filter:</span>
          <Select defaultValue={kelas_id || ""}>
            <SelectTrigger className="w-[220px] bg-slate-50 border-slate-200">
              <SelectValue placeholder="Pilih kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Kelas</SelectItem>
              {kelasList?.map((kelas) => (
                <SelectItem key={kelas.id} value={kelas.id}>
                  {kelas.nama_kelas}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <SiswaTable
          siswaList={siswaList || []}
          kelasList={kelasList || []}
        />
      </div>
    </DashboardLayout>
  )
}