"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
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
import { Plus } from "lucide-react"

interface Kelas {
  id: string
  nama_kelas: string
}

export function AddSiswaDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [isLoadingKelas, setIsLoadingKelas] = useState(false)
  const [formData, setFormData] = useState({
    nisn: "",
    nama: "",
    password: "",
    kelas_id: "",
  })

  // Fetch kelas list when dialog opens
  useEffect(() => {
    if (open) {
      fetchKelasList()
    }
  }, [open])

  const fetchKelasList = async () => {
    setIsLoadingKelas(true)
    try {
      const response = await fetch("/api/guru/kelas")
      const result = await response.json()
      if (result.success) {
        setKelasList(result.data?.kelas || [])
      } else {
        toast.error("Gagal memuat daftar kelas")
      }
    } catch (error) {
      console.error("Error fetching kelas:", error)
      toast.error("Gagal memuat daftar kelas")
    } finally {
      setIsLoadingKelas(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nisn.trim() || !formData.nama.trim() || !formData.password.trim()) {
      toast.error("Semua field wajib diisi")
      return
    }

    setIsLoading(true)

    try {
      const body: Record<string, string> = {
        nisn: formData.nisn,
        nama: formData.nama,
        password: formData.password,
      }

      if (formData.kelas_id) {
        body.kelas_id = formData.kelas_id
      }

      const response = await fetch("/api/guru/siswa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || "Terjadi kesalahan")
      }

      toast.success("Siswa berhasil ditambahkan")
      setFormData({ nisn: "", nama: "", password: "", kelas_id: "" })
      setOpen(false)
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25">
            <Plus className="h-4 w-4" />
            Tambah Siswa
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Siswa Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nisn">NISN</Label>
            <Input
              id="nisn"
              type="text"
              placeholder="Masukkan NISN"
              value={formData.nisn}
              onChange={(e) => setFormData((prev) => ({ ...prev, nisn: e.target.value }))}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nama">Nama Lengkap</Label>
            <Input
              id="nama"
              type="text"
              placeholder="Masukkan nama lengkap"
              value={formData.nama}
              onChange={(e) => setFormData((prev) => ({ ...prev, nama: e.target.value }))}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kelas">Kelas</Label>
            <Select
              value={formData.kelas_id}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, kelas_id: value || "" }))}
              disabled={isLoading || isLoadingKelas}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingKelas ? "Memuat..." : "Pilih kelas"}>
                  {formData.kelas_id
                    ? kelasList.find((k) => k.id === formData.kelas_id)?.nama_kelas
                    : ""}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {kelasList.length > 0 ? (
                  kelasList.map((kelas) => (
                    <SelectItem key={kelas.id} value={kelas.id}>
                      {kelas.nama_kelas}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    {isLoadingKelas ? "Memuat..." : "Belum ada kelas"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Tambah Siswa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
