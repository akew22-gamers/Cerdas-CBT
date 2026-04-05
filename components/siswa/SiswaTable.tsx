"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2, GraduationCap, School, ChevronLeft, ChevronRight } from "lucide-react"
import { ResetPasswordDialog } from "./ResetPasswordDialog"
import { EditSiswaDialog } from "./EditSiswaDialog"

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

interface SiswaTableProps {
  siswaList: Siswa[]
  onRefresh?: () => void
  kelasList?: Kelas[]
  sortKey?: string
  onSortKeyChange?: (value: string) => void
  itemsPerPage?: number
  onItemsPerPageChange?: (value: number) => void
  searchQuery?: string
  totalSiswa?: number
}

export function SiswaTable({ 
  siswaList, 
  onRefresh, 
  kelasList = [],
  sortKey = 'nama_asc',
  onSortKeyChange,
  itemsPerPage = 10,
  onItemsPerPageChange,
  searchQuery = '',
  totalSiswa
}: SiswaTableProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [selectedSiswa, setSelectedSiswa] = React.useState<Siswa | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = React.useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = React.useState(false)

  const sortedList = React.useMemo(() => {
    return [...siswaList].sort((a, b) => {
      if (sortKey === 'nama_asc') return (a.nama || '').localeCompare(b.nama || '')
      if (sortKey === 'nama_desc') return (b.nama || '').localeCompare(a.nama || '')
      if (sortKey === 'nisn_asc') return (a.nisn || '').localeCompare(b.nisn || '')
      if (sortKey === 'nisn_desc') return (b.nisn || '').localeCompare(a.nisn || '')
      return 0
    })
  }, [siswaList, sortKey])

  const filteredList = React.useMemo(() => {
    if (!searchQuery) return sortedList
    const query = searchQuery.toLowerCase()
    return sortedList.filter(siswa => 
      siswa.nama.toLowerCase().includes(query) ||
      siswa.nisn.toLowerCase().includes(query)
    )
  }, [sortedList, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredList.length / itemsPerPage))
  
  const paginatedList = React.useMemo(() => {
    return filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }, [filteredList, currentPage, itemsPerPage])

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1)
  }, [totalPages, currentPage])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, sortKey, itemsPerPage])

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedList.map(s => s.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id])
    } else {
      setSelectedIds(prev => prev.filter(x => x !== id))
    }
  }

  const handleDeleteClick = (siswa: Siswa) => {
    setSelectedSiswa(siswa)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedSiswa) return
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/guru/siswa/${selectedSiswa.id}`, { method: "DELETE" })
      const result = await response.json()
      if (!result.success) throw new Error(result.error?.message || "Gagal menghapus siswa")
      
      toast.success("Siswa berhasil dihapus")
      setSelectedIds(prev => prev.filter(id => id !== selectedSiswa.id))
      onRefresh?.() || router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus siswa")
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setSelectedSiswa(null)
    }
  }

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return
    setIsBulkDeleting(true)
    try {
      for (const id of selectedIds) {
        const response = await fetch(`/api/guru/siswa/${id}`, { method: "DELETE" })
        const result = await response.json()
        if (!result.success) throw new Error(result.error?.message || "Gagal menghapus sebagian siswa")
      }
      toast.success(`${selectedIds.length} Siswa berhasil dihapus`)
      setSelectedIds([])
      onRefresh?.() || router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus kumpulan data siswa")
    } finally {
      setIsBulkDeleting(false)
      setBulkDeleteDialogOpen(false)
    }
  }

  const handlePasswordReset = () => {
    onRefresh?.() || router.refresh()
  }

  const isAllOnPageSelected = paginatedList.length > 0 && paginatedList.every(s => selectedIds.includes(s.id))

  const displayTotal = totalSiswa ?? siswaList.length

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 ? (
            <Button 
              variant="destructive" 
              size="sm" 
              className="gap-2"
              onClick={() => setBulkDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4" />
              Hapus Terpilih ({selectedIds.length})
            </Button>
          ) : (
            <span className="text-sm text-slate-500 font-medium">Total: {displayTotal} Siswa{searchQuery && filteredList.length !== displayTotal && ` (ditampilkan: ${filteredList.length})`}</span>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
              <TableHead className="w-12 text-center text-slate-600">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  checked={isAllOnPageSelected}
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-16 text-slate-600 font-semibold">No</TableHead>
              <TableHead className="text-slate-600 font-semibold">NISN</TableHead>
              <TableHead className="text-slate-600 font-semibold">Nama</TableHead>
              <TableHead className="text-slate-600 font-semibold">Kelas</TableHead>
              <TableHead className="w-48 text-slate-600 font-semibold">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <GraduationCap className="w-8 h-8 text-slate-300" />
                    <p>{searchQuery ? 'Tidak ada siswa yang sesuai pencarian' : 'Belum ada data siswa'}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedList.map((siswa, index) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + index + 1
                return (
                  <TableRow key={siswa.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        checked={selectedIds.includes(siswa.id)}
                        onChange={(e) => handleSelectRow(siswa.id, e.target.checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-slate-600">{globalIndex}</TableCell>
                    <TableCell className="text-slate-900 font-medium">{siswa.nisn}</TableCell>
                    <TableCell className="text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-semibold">
                          {siswa.nama?.substring(0, 2).toUpperCase() || "SW"}
                        </div>
                        {siswa.nama}
                      </div>
                    </TableCell>
                    <TableCell>
                      {siswa.kelas ? (
                        <div className="flex items-center gap-1.5">
                          <School className="w-3.5 h-3.5 text-slate-400" />
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md text-xs font-medium text-slate-700 whitespace-nowrap">
                            {siswa.kelas.nama_kelas}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <EditSiswaDialog
                          siswa={siswa}
                          kelasList={kelasList || []}
                          onUpdated={onRefresh}
                        />
                        <ResetPasswordDialog
                          siswaId={siswa.id}
                          siswaNama={siswa.nama}
                          onPasswordReset={handlePasswordReset}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(siswa)}
                          title="Hapus"
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
        
        {filteredList.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50 sm:px-6">
            <div className="hidden sm:block">
              <p className="text-sm text-slate-700">
                Menampilkan <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> sampai <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredList.length)}</span> dari <span className="font-medium">{filteredList.length}</span> data
              </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="gap-1 h-8"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </Button>
              <div className="flex justify-center items-center px-3 text-sm font-medium text-slate-700 sm:hidden">
                Hal {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="gap-1 h-8"
              >
                <span className="hidden sm:inline">Selanjutnya</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent className="border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900">Hapus Data Terpilih</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Apakah Anda yakin ingin menghapus <span className="font-bold text-slate-700">{selectedIds.length}</span> siswa terpilih?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkDeleting} className="border-slate-200">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDeleteConfirm}
              disabled={isBulkDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isBulkDeleting ? "Menghapus..." : "Hapus Semua"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900">Hapus Siswa</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Apakah Anda yakin ingin menghapus siswa <span className="font-semibold text-slate-700">{selectedSiswa?.nama}</span>?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="border-slate-200">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}