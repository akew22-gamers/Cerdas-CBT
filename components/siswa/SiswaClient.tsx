"use client"

import * as React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { SiswaTable } from "./SiswaTable"
import { KelasFilter } from "./KelasFilter"
import { AddSiswaDialog } from "./AddSiswaDialog"
import { ImportSiswaButton } from "./ImportSiswaButton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search, Users } from "lucide-react"

interface Kelas {
  id: string
  nama_kelas: string
}

interface Siswa {
  id: string
  nisn: string
  nama: string
  kelas_id?: string | null
  kelas: {
    id: string
    nama_kelas: string
  } | null
}

interface SiswaClientProps {
  siswaList: Siswa[]
  kelasList: Kelas[]
}

export function SiswaClient({ siswaList, kelasList }: SiswaClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [sortKey, setSortKey] = React.useState('nama_asc')
  const [itemsPerPage, setItemsPerPage] = React.useState(10)
  const [searchQuery, setSearchQuery] = React.useState('')
  
  const kelasId = searchParams.get('kelas_id')
  const selectedKelas = kelasId ? kelasList.find(k => k.id === kelasId) : null

  const handleKelasChange = (value: string | null) => {
    const val = value || ""
    if (val === "") {
      router.push(pathname)
    } else {
      router.push(`${pathname}?kelas_id=${val}`)
    }
  }

  const handleRefresh = () => {
    router.refresh()
  }

  return (
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
          <ImportSiswaButton />
          <AddSiswaDialog />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="text-sm font-medium text-slate-600 shrink-0">Filter:</span>
        
        <KelasFilter 
          kelasList={kelasList} 
          selectedKelasId={kelasId || null}
          selectedKelasName={selectedKelas?.nama_kelas || null}
        />

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Urutkan:</span>
          <Select value={sortKey} onValueChange={(val) => { if (val) setSortKey(val) }}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Urutan..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nama_asc">Nama (A-Z)</SelectItem>
              <SelectItem value="nama_desc">Nama (Z-A)</SelectItem>
              <SelectItem value="nisn_asc">NISN (A-Z)</SelectItem>
              <SelectItem value="nisn_desc">NISN (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Tampilkan:</span>
          <Select value={itemsPerPage.toString()} onValueChange={(val) => {
            if (val) {
              setItemsPerPage(Number(val))
            }
          }}>
            <SelectTrigger className="w-[80px] h-9">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        <span className="text-sm text-slate-500 font-medium">
          Total: {siswaList.length} Siswa
        </span>
      </div>

      <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <Input
          placeholder="Cari berdasarkan nama atau NISN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-0 shadow-none focus-visible:ring-0 h-9"
        />
      </div>

      <SiswaTable
        siswaList={siswaList}
        kelasList={kelasList}
        onRefresh={handleRefresh}
        sortKey={sortKey}
        onSortKeyChange={setSortKey}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        searchQuery={searchQuery}
        totalSiswa={siswaList.length}
      />
    </div>
  )
}