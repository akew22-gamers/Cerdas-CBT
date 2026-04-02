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
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, CheckCircle, ArrowLeft, Users, Check } from "lucide-react"

interface Kelas {
  id: string
  nama_kelas: string
}

export function AddUjianDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"form" | "confirm">("form")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingKelas, setIsFetchingKelas] = useState(false)
  const [judul, setJudul] = useState("")
  const [durasi, setDurasi] = useState("")
  const [jumlahOpsi, setJumlahOpsi] = useState<"4" | "5">("4")
  const [showResult, setShowResult] = useState(true)
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [selectedKelasIds, setSelectedKelasIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (open) {
      fetchKelas()
    }
  }, [open])

  const fetchKelas = async () => {
    setIsFetchingKelas(true)
    try {
      const response = await fetch("/api/guru/kelas", {
        credentials: 'include'
      })
      const result = await response.json()

      if (result.success) {
        setKelasList(result.data.kelas)
      }
    } catch (error) {
      console.error("Fetch kelas error:", error)
    } finally {
      setIsFetchingKelas(false)
    }
  }

  const toggleKelas = (kelasId: string) => {
    const newSelected = new Set(selectedKelasIds)
    if (newSelected.has(kelasId)) {
      newSelected.delete(kelasId)
    } else {
      newSelected.add(kelasId)
    }
    setSelectedKelasIds(newSelected)
  }

  const handleNextStep = () => {
    if (!judul.trim()) {
      toast.error("Judul ujian harus diisi")
      return
    }

    const durasiNum = parseInt(durasi, 10)
    if (!durasi || isNaN(durasiNum) || durasiNum < 1) {
      toast.error("Durasi ujian harus minimal 1 menit")
      return
    }

    setStep("confirm")
  }

  const handleSubmit = async () => {
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
          durasi: parseInt(durasi, 10),
          jumlah_opsi: parseInt(jumlahOpsi, 10),
          show_result: showResult,
          kelas_ids: Array.from(selectedKelasIds),
        }),
      })

      const result = await response.json()

      if (!result.success) {
        toast.error(result.error?.message || "Terjadi kesalahan")
        return
      }

      toast.success("Ujian berhasil dibuat")
      setOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error("Form error:", error)
      toast.error("Terjadi kesalahan pada server")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setStep("form")
    setJudul("")
    setDurasi("")
    setJumlahOpsi("4")
    setShowResult(true)
    setSelectedKelasIds(new Set())
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      resetForm()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Ujian Baru
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "form" ? "Buat Ujian Baru" : "Konfirmasi Ujian"}
          </DialogTitle>
        </DialogHeader>

        {step === "form" ? (
          <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="jumlah_opsi">Jumlah Opsi</Label>
                <Select
                  value={jumlahOpsi}
                  onValueChange={(value) => value && setJumlahOpsi(value as "4" | "5")}
                  disabled={isLoading}
                >
                  <SelectTrigger id="jumlah_opsi">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 Opsi (A-D)</SelectItem>
                    <SelectItem value="5">5 Opsi (A-E)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                <span className="text-sm">Tampilkan hasil kepada siswa setelah selesai</span>
              </Label>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Assign ke Kelas {selectedKelasIds.size > 0 && `(${selectedKelasIds.size} dipilih)`}
              </Label>
              {isFetchingKelas ? (
                <p className="text-sm text-gray-500 py-2">Memuat data kelas...</p>
              ) : kelasList.length === 0 ? (
                <p className="text-sm text-gray-500 py-2">Belum ada kelas. Buat kelas terlebih dahulu.</p>
              ) : (
                <div className="border rounded-lg max-h-40 overflow-y-auto">
                  {kelasList.map((kelas) => {
                    const isSelected = selectedKelasIds.has(kelas.id)
                    return (
                      <button
                        key={kelas.id}
                        type="button"
                        onClick={() => toggleKelas(kelas.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                          isSelected
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isSelected
                              ? "bg-primary border-primary"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span>{kelas.nama_kelas}</span>
                      </button>
                    )
                  })}
                </div>
              )}
              <p className="text-xs text-gray-500">
                Pilih kelas yang akan mengerjakan ujian ini. Bisa diubah nanti.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                Lanjutkan
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-3 text-sm w-full">
                  <p className="font-medium text-blue-900">Periksa kembali data ujian:</p>
                  <div className="space-y-2 text-blue-800">
                    <div className="flex justify-between">
                      <span className="text-blue-600">Judul:</span>
                      <span className="font-medium text-right ml-2">{judul}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Durasi:</span>
                      <span className="font-medium">{durasi} menit</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Jumlah Opsi:</span>
                      <span className="font-medium">{jumlahOpsi} opsi</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Tampilkan Hasil:</span>
                      <span className="font-medium">{showResult ? "Ya" : "Tidak"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Kelas:</span>
                      <span className="font-medium text-right ml-2">
                        {selectedKelasIds.size > 0 
                          ? `${selectedKelasIds.size} kelas dipilih`
                          : "Belum ada kelas"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Setelah dibuat, Anda dapat menambahkan soal melalui menu Soal.
            </p>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("form")}
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Kembali
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Membuat..." : "Buat Ujian"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}