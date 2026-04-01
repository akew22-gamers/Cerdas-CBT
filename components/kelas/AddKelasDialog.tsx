"use client"

import { useState } from "react"
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
import { Plus } from "lucide-react"

export function AddKelasDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [namaKelas, setNamaKelas] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!namaKelas.trim()) {
      toast.error("Nama kelas harus diisi")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/guru/kelas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_kelas: namaKelas.trim(),
        }),
      })

      const result = await response.json()

      if (!result.success) {
        toast.error(result.error?.message || "Terjadi kesalahan")
        return
      }

      toast.success("Kelas berhasil dibuat")
      setNamaKelas("")
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Form error:", error)
      toast.error("Terjadi kesalahan pada server")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Kelas Baru
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buat Kelas Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama_kelas">Nama Kelas</Label>
            <Input
              id="nama_kelas"
              type="text"
              placeholder="Contoh: X IPA 1"
              value={namaKelas}
              onChange={(e) => setNamaKelas(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Masukkan nama kelas yang jelas dan mudah dikenali
            </p>
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
              {isLoading ? "Menyimpan..." : "Buat Kelas"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
