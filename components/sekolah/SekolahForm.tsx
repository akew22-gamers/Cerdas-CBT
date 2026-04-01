"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { School, Building2, Phone, Mail, Globe, MapPin, User } from "lucide-react"

interface SekolahFormData {
  nama_sekolah?: string
  npsn?: string
  alamat?: string
  logo_url?: string
  telepon?: string
  email?: string
  website?: string
  kepala_sekolah?: string
  tahun_ajaran?: string
}

interface SekolahFormProps {
  initialData?: SekolahFormData
  readOnly?: boolean
  apiEndpoint?: string
}

export function SekolahForm({ initialData, readOnly = false, apiEndpoint = "/api/admin/sekolah" }: SekolahFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState<SekolahFormData>({
    nama_sekolah: initialData?.nama_sekolah || "",
    npsn: initialData?.npsn || "",
    alamat: initialData?.alamat || "",
    logo_url: initialData?.logo_url || "",
    telepon: initialData?.telepon || "",
    email: initialData?.email || "",
    website: initialData?.website || "",
    kepala_sekolah: initialData?.kepala_sekolah || "",
    tahun_ajaran: initialData?.tahun_ajaran || "2025/2026"
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(apiEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || "Terjadi kesalahan")
      }

      toast.success("Data sekolah berhasil disimpan")
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur-xl opacity-20" />
        <div className="relative flex items-center gap-3">
          <div className="h-12 w-12 flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/30">
            <School className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
              Data Sekolah
            </h2>
            <p className="text-sm text-slate-500">Lengkapi informasi identitas sekolah</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nama_sekolah" className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-violet-500" />
            Nama Sekolah <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nama_sekolah"
            name="nama_sekolah"
            type="text"
            placeholder="Masukkan nama sekolah"
            value={formData.nama_sekolah}
            onChange={handleInputChange}
            required
            disabled={isLoading || readOnly}
            className="focus:ring-2 focus:ring-violet-500/20 border-slate-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tahun_ajaran" className="flex items-center gap-2">
            <User className="h-4 w-4 text-violet-500" />
            Tahun Ajaran <span className="text-red-500">*</span>
          </Label>
          <Input
            id="tahun_ajaran"
            name="tahun_ajaran"
            type="text"
            placeholder="Contoh: 2025/2026"
            value={formData.tahun_ajaran}
            onChange={handleInputChange}
            required
            disabled={isLoading || readOnly}
            className="focus:ring-2 focus:ring-violet-500/20 border-slate-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="npsn" className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-violet-500" />
            NPSN
          </Label>
          <Input
            id="npsn"
            name="npsn"
            type="text"
            placeholder="Masukkan NPSN"
            value={formData.npsn}
            onChange={handleInputChange}
            disabled={isLoading || readOnly}
            className="focus:ring-2 focus:ring-violet-500/20 border-slate-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="kepala_sekolah" className="flex items-center gap-2">
            <User className="h-4 w-4 text-violet-500" />
            Kepala Sekolah
          </Label>
          <Input
            id="kepala_sekolah"
            name="kepala_sekolah"
            type="text"
            placeholder="Nama kepala sekolah"
            value={formData.kepala_sekolah}
            onChange={handleInputChange}
            disabled={isLoading || readOnly}
            className="focus:ring-2 focus:ring-violet-500/20 border-slate-200"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="alamat" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-violet-500" />
            Alamat
          </Label>
          <Textarea
            id="alamat"
            name="alamat"
            placeholder="Masukkan alamat lengkap"
            value={formData.alamat}
            onChange={handleInputChange}
            disabled={isLoading || readOnly}
            rows={3}
            className="focus:ring-2 focus:ring-violet-500/20 border-slate-200 resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telepon" className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-violet-500" />
            Telepon
          </Label>
          <Input
            id="telepon"
            name="telepon"
            type="text"
            placeholder="Masukkan nomor telepon"
            value={formData.telepon}
            onChange={handleInputChange}
            disabled={isLoading || readOnly}
            className="focus:ring-2 focus:ring-violet-500/20 border-slate-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-violet-500" />
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="contoh@sekolah.sch.id"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading || readOnly}
            className="focus:ring-2 focus:ring-violet-500/20 border-slate-200"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="website" className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-violet-500" />
            Website
          </Label>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://www.sekolah.sch.id"
            value={formData.website}
            onChange={handleInputChange}
            disabled={isLoading || readOnly}
            className="focus:ring-2 focus:ring-violet-500/20 border-slate-200"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="logo_url" className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-violet-500" />
            URL Logo
          </Label>
          <Input
            id="logo_url"
            name="logo_url"
            type="url"
            placeholder="https://example.com/logo.png"
            value={formData.logo_url}
            onChange={handleInputChange}
            disabled={isLoading || readOnly}
            className="focus:ring-2 focus:ring-violet-500/20 border-slate-200"
          />
          <p className="text-xs text-slate-500">
            Masukkan URL gambar untuk logo sekolah
          </p>
        </div>
      </div>

      {!readOnly && (
        <div className="flex gap-3 pt-2">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/30"
          >
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.refresh()}
            disabled={isLoading}
            className="border-slate-200 hover:bg-slate-50"
          >
            Batal
          </Button>
        </div>
      )}
    </form>
  )
}
