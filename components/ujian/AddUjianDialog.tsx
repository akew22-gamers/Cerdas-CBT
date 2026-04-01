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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"

export function AddUjianDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [judul, setJudul] = useState("")
  const [durasi, setDurasi] = useState("")
  const [jumlahOpsi, setJumlahOpsi] = useState<"4" | "5">("4")
  const [showResult, setShowResult] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!judul.trim()) {
      toast.error("Judul ujian harus diisi")
      return
    }

    const durasiNum = parseInt(durasi, 10)
    if (!durasi || isNaN(durasiNum) || durasiNum < 1) {
      toast.error("Durasi ujian harus minimal 1 menit")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/guru/ujian", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          judul: judul.trim(),
          durasi: durasiNum,
          jumlah_opsi: parseInt(jumlahOpsi, 10),
          show_result: showResult,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        toast.error(result.error?.message || "Terjadi kesalahan")
        return
      }

      toast.success("Ujian berhasil dibuat")
      setOpen(false)
      setJudul("")
      setDurasi("")
      setJumlahOpsi("4")
      setShowResult(true)
      router.push(`/guru/ujian/${result.data.id}/edit`)
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
            Ujian Baru
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buat Ujian Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="judul">Judul Ujian</Label>
            <Input
              id="judul"
              type="text"
              placeholder="Contoh: Ujian Matematika Bab 1"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="durasi">Durasi (menit)</Label>
            <Input
              id="durasi"
              type="number"
              placeholder="Contoh: 60"
              value={durasi}
              onChange={(e) => setDurasi(e.target.value)}
              min="1"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jumlah_opsi">Jumlah Opsi Jawaban</Label>
            <Select
              value={jumlahOpsi}
              onValueChange={(value) => value && setJumlahOpsi(value as "4" | "5")}
              disabled={isLoading}
            >
              <SelectTrigger id="jumlah_opsi">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 Opsi (A, B, C, D)</SelectItem>
                <SelectItem value="5">5 Opsi (A, B, C, D, E)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showResult}
                onChange={(e) => setShowResult(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                disabled={isLoading}
              />
              <span className="text-sm">Tampilkan hasil ujian kepada siswa setelah selesai</span>
            </Label>
            <p className="text-xs text-muted-foreground ml-7">
              Jika dicentang, siswa dapat melihat nilai mereka setelah submit ujian
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
              {isLoading ? "Menyimpan..." : "Buat Ujian"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
