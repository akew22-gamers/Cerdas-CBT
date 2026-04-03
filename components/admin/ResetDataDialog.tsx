"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ResetDataDialogProps {
  onDataReset: () => void
}

export function ResetDataDialog({ onDataReset }: ResetDataDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [confirmText, setConfirmText] = React.useState("")

  const handleReset = async () => {
    if (confirmText !== "RESET") {
      toast.error("Ketik 'RESET' untuk mengkonfirmasi")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/reset-data", {
        method: "POST",
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || "Gagal mereset data")
      }

      toast.success("Data berhasil di-reset")
      setIsOpen(false)
      setConfirmText("")
      onDataReset()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Gagal mereset data"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 hover:bg-red-50 hover:border-red-200 group transition-all">
            <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
              <Trash2 className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-900">Reset Data</p>
              <p className="text-xs text-slate-500">Hapus data siswa, kelas, ujian, soal</p>
            </div>
          </Button>
        }
      />
      <AlertDialogContent size="default">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-red-100">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </AlertDialogMedia>
          <AlertDialogTitle>Reset Data Sistem</AlertDialogTitle>
          <AlertDialogDescription className="text-left space-y-3">
            <p className="text-red-600 font-medium">
              Peringatan: Tindakan ini tidak dapat dibatalkan!
            </p>
            <p>
              Data berikut akan dihapus permanen:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>Semua data siswa</li>
              <li>Semua data kelas</li>
              <li>Semua data ujian</li>
              <li>Semua data soal</li>
              <li>Semua hasil ujian</li>
              <li>Semua jawaban siswa</li>
            </ul>
            <p className="text-sm font-medium">
              Data yang akan dipertahankan:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>Akun super admin</li>
              <li>Data guru</li>
              <li>Identitas sekolah</li>
              <li>Log audit</li>
            </ul>
            <div className="pt-2">
              <label className="text-sm font-medium">
                Ketik <span className="font-bold text-red-600">RESET</span> untuk mengkonfirmasi:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Ketik RESET"
                disabled={isLoading}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" size="default" disabled={isLoading}>
            Batal
          </AlertDialogCancel>
          <Button
            onClick={handleReset}
            disabled={isLoading || confirmText !== "RESET"}
            variant="destructive"
            className="w-full sm:w-auto"
          >
            {isLoading ? "Mereset..." : "Reset Data"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}