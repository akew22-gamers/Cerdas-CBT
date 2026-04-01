"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil } from "lucide-react"

interface Kelas {
  id: string
  nama_kelas: string
}

interface EditKelasDialogProps {
  kelas: Kelas
  onUpdated?: () => void
}

export function EditKelasDialog({ kelas, onUpdated }: EditKelasDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [namaKelas, setNamaKelas] = React.useState(kelas.nama_kelas)

  React.useEffect(() => {
    if (isOpen) {
      setNamaKelas(kelas.nama_kelas)
    }
  }, [isOpen, kelas.nama_kelas])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!namaKelas.trim()) {
      toast.error("Nama kelas harus diisi")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/guru/kelas/${kelas.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_kelas: namaKelas.trim(),
        }),
      })

      const result = await response.json()

      if (!result.success) {
        toast.error(result.error?.message || "Gagal mengupdate kelas")
        return
      }

      toast.success("Kelas berhasil diupdate")
      setIsOpen(false)
      onUpdated?.()
    } catch (error) {
      console.error("Update error:", error)
      toast.error("Terjadi kesalahan saat mengupdate kelas")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        }
      />
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Kelas</DialogTitle>
            <DialogDescription>
              Ubah nama kelas sesuai kebutuhan
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_nama_kelas">Nama Kelas</Label>
              <Input
                id="edit_nama_kelas"
                type="text"
                placeholder="Contoh: X IPA 1"
                value={namaKelas}
                onChange={(e) => setNamaKelas(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">
                Masukkan nama kelas yang jelas dan mudah dikenali
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
