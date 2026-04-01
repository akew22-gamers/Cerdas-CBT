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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Pencil } from "lucide-react"

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

interface EditSiswaDialogProps {
  siswa: Siswa
  kelasList: Kelas[]
  onUpdated?: () => void
}

export function EditSiswaDialog({ siswa, kelasList, onUpdated }: EditSiswaDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    nisn: siswa.nisn,
    nama: siswa.nama,
    kelas_id: siswa.kelas_id || "",
  })

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        nisn: siswa.nisn,
        nama: siswa.nama,
        kelas_id: siswa.kelas_id || "",
      })
    }
  }, [isOpen, siswa])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nisn.trim() || !formData.nama.trim()) {
      toast.error("NISN dan nama harus diisi")
      return
    }

    setIsLoading(true)

    try {
      const body: Record<string, string> = {
        nisn: formData.nisn,
        nama: formData.nama,
      }

      if (formData.kelas_id) {
        body.kelas_id = formData.kelas_id
      }

      const response = await fetch(`/api/guru/siswa/${siswa.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (!result.success) {
        toast.error(result.error?.message || "Gagal mengupdate siswa")
        return
      }

      toast.success("Siswa berhasil diupdate")
      setIsOpen(false)
      onUpdated?.()
    } catch (error) {
      console.error("Update error:", error)
      toast.error("Terjadi kesalahan saat mengupdate siswa")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            title="Edit"
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        }
      />
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Siswa</DialogTitle>
            <DialogDescription>
              Update data siswa {siswa.nama}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_nisn">NISN</Label>
              <Input
                id="edit_nisn"
                type="text"
                placeholder="Masukkan NISN"
                value={formData.nisn}
                onChange={(e) => setFormData(prev => ({ ...prev, nisn: e.target.value }))}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_nama">Nama Lengkap</Label>
              <Input
                id="edit_nama"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_kelas">Kelas</Label>
              <Select
                value={formData.kelas_id || "__none__"}
                onValueChange={(value: string | null) => setFormData(prev => ({ ...prev, kelas_id: value === "__none__" ? "" : (value || "") }))}
                disabled={isLoading}
              >
                <SelectTrigger id="edit_kelas">
                  <SelectValue placeholder="Pilih kelas">
                    {formData.kelas_id ? kelasList.find(k => k.id === formData.kelas_id)?.nama_kelas : "Pilih kelas (opsional)"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Tidak ada kelas</SelectItem>
                  {kelasList.length > 0 ? (
                    kelasList.map((kelas) => (
                      <SelectItem key={kelas.id} value={kelas.id}>
                        {kelas.nama_kelas}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Belum ada kelas
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
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
              {isLoading ? "Mengupdate..." : "Update Siswa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
