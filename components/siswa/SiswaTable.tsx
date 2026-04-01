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
import { Trash2, GraduationCap, School } from "lucide-react"
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
}

export function SiswaTable({ siswaList, onRefresh, kelasList = [] }: SiswaTableProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [selectedSiswa, setSelectedSiswa] = React.useState<Siswa | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDeleteClick = (siswa: Siswa) => {
    setSelectedSiswa(siswa)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedSiswa) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/guru/siswa/${selectedSiswa.id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || "Gagal menghapus siswa")
      }

      toast.success("Siswa berhasil dihapus")
      onRefresh?.() || router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Gagal menghapus siswa"
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setSelectedSiswa(null)
    }
  }

  const handlePasswordReset = () => {
    onRefresh?.() || router.refresh()
  }

  return (
    <>
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
              <TableHead className="w-16 text-slate-600 font-semibold">No</TableHead>
              <TableHead className="text-slate-600 font-semibold">NISN</TableHead>
              <TableHead className="text-slate-600 font-semibold">Nama</TableHead>
              <TableHead className="text-slate-600 font-semibold">Kelas</TableHead>
              <TableHead className="w-48 text-slate-600 font-semibold">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {siswaList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <GraduationCap className="w-8 h-8 text-slate-300" />
                    <p>Belum ada data siswa</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              siswaList.map((siswa, index) => (
                <TableRow key={siswa.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium text-slate-600">{index + 1}</TableCell>
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
                        <span className="px-2 py-0.5 bg-slate-100 rounded-md text-xs font-medium text-slate-700">
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
    </>
  )
}
