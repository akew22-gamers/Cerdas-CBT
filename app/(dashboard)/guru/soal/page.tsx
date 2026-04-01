import { getSession } from "@/lib/auth/session"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/layout"
import { SoalTable } from "@/components/soal/SoalTable"
import { UjianFilter } from "@/components/soal/UjianFilter"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Upload, FileQuestion, Plus, AlertCircle } from "lucide-react"

interface Soal {
  id: string
  ujian_id: string
  teks_soal: string
  gambar_url?: string | null
  jawaban_benar: string
  pengecoh_1: string
  pengecoh_2: string
  pengecoh_3?: string | null
  pengecoh_4?: string | null
  urutan: number
}

interface Ujian {
  id: string
  judul: string
  kode_ujian: string
  status: 'aktif' | 'nonaktif'
}

async function fetchData(searchParamsProps: { ujian_id?: string }): Promise<{
  soal: Soal[]
  ujian: Ujian[]
  selectedUjianId: string | null
  ujianStatus: 'aktif' | 'nonaktif'
  user: { nama: string; username: string; role: string }
}> {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.user.role !== "guru") {
    redirect("/login")
  }

  const supabase = createAdminClient()

  const { data: ujianList } = await supabase
    .from("ujian")
    .select("id, judul, kode_ujian, status")
    .eq("created_by", session.user.id)
    .order("created_at", { ascending: false })

  const selectedUjianId = searchParamsProps.ujian_id || null

  let soal: Soal[] = []
  let ujianStatus: 'aktif' | 'nonaktif' = 'nonaktif'

  if (selectedUjianId) {
    const { data: soalData, error } = await supabase
      .from("soal")
      .select("*")
      .eq("ujian_id", selectedUjianId)
      .order("urutan", { ascending: true })

    if (!error && soalData) {
      soal = soalData
    }

    const { data: ujianData } = await supabase
      .from("ujian")
      .select("status")
      .eq("id", selectedUjianId)
      .eq("created_by", session.user.id)
      .single()

    if (ujianData) {
      ujianStatus = ujianData.status
    }
  }

  return {
    soal,
    ujian: ujianList || [],
    selectedUjianId,
    ujianStatus,
    user: { nama: session.user.nama || "Guru", username: session.user.username, role: "guru" }
  }
}

export default async function SoalListPage({ searchParams }: { searchParams: Promise<{ ujian_id?: string }> }) {
  const resolvedSearchParams = await searchParams
  const { soal, ujian, selectedUjianId, ujianStatus, user } = await fetchData(resolvedSearchParams)

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/25">
              <FileQuestion className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Manajemen Soal</h1>
              <p className="text-slate-500 mt-0.5">Kelola soal untuk ujian Anda</p>
            </div>
          </div>
          <div className="flex gap-2">
            {selectedUjianId && (
              <Link href={`/guru/soal/import?ujian_id=${selectedUjianId}`}>
                <Button variant="outline" className="gap-2 hover:bg-slate-50">
                  <Upload className="h-4 w-4" />
                  Import Excel
                </Button>
              </Link>
            )}
            <Link
              href={selectedUjianId ? `/guru/soal/create?ujian_id=${selectedUjianId}` : "/guru/soal/create"}
            >
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25">
                <Plus className="h-4 w-4" />
                Soal Baru
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
          <UjianFilter ujianList={ujian} selectedUjianId={selectedUjianId} />
        </div>

        {!selectedUjianId ? (
          <div className="bg-white rounded-xl border border-slate-200/80 p-12 shadow-sm text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileQuestion className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">Pilih ujian terlebih dahulu</p>
            <p className="text-sm text-slate-400 mt-1">Silakan pilih ujian dari dropdown di atas</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200/80 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">
                    {ujian.find(u => u.id === selectedUjianId)?.judul}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {soal.length} soal • Status: 
                    <span className={ujianStatus === 'aktif' ? 'text-emerald-600 font-medium ml-1' : 'text-slate-600 ml-1'}>
                      {ujianStatus === 'aktif' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </p>
                </div>
                {ujianStatus === 'aktif' && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg border border-amber-200">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-medium text-amber-700">
                      Edit & hapus dinonaktifkan
                    </span>
                  </div>
                )}
              </div>
            </div>
            <SoalTable
              data={soal}
              ujianStatus={ujianStatus}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}