"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Eye, EyeOff, QrCode, Keyboard, GraduationCap, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface UjianLoginPageProps {
  schoolName: string
  ujianId?: string
  siswaId?: string
  kodeUjian?: string
}

export function UjianLoginPage({ schoolName, ujianId, siswaId, kodeUjian }: UjianLoginPageProps) {
  const [activeTab, setActiveTab] = useState<"qr" | "manual">("qr")
  const [nisn, setNisn] = useState("")
  const [password, setPassword] = useState("")
  const [kodeUjianInput, setKodeUjianInput] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (kodeUjian) {
      setKodeUjianInput(kodeUjian)
    }
    if (siswaId && ujianId) {
      setActiveTab("manual")
    }
  }, [siswaId, ujianId, kodeUjian])

  const validateForm = (): boolean => {
    if (!nisn.trim()) {
      toast.error("NISN harus diisi")
      return false
    }
    if (!password) {
      toast.error("Password harus diisi")
      return false
    }
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter")
      return false
    }
    if (!kodeUjianInput.trim()) {
      toast.error("Kode Ujian harus diisi")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/ujian/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nisn: nisn.trim(),
          password,
          kode_ujian: kodeUjianInput.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Login gagal")
      }

      toast.success("Login berhasil! Mengarahkan ke ujian...")

      if (data.data?.redirect_url) {
        window.location.href = data.data.redirect_url
      } else {
        window.location.href = "/siswa/ujian"
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan"
      toast.error(message)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 mb-4">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Masuk Ujian</h2>
        <p className="text-sm text-slate-500 mt-1">
          Pilih cara masuk untuk memulai ujian
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "qr" | "manual")}>
        <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1">
          <TabsTrigger
            value="qr"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600"
          >
            <QrCode className="w-4 h-4" />
            <span className="text-sm font-medium">Scan QR</span>
          </TabsTrigger>
          <TabsTrigger
            value="manual"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600"
          >
            <Keyboard className="w-4 h-4" />
            <span className="text-sm font-medium">Login Manual</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="qr" className="mt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-48 h-48 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl" />
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200/80 mb-3">
                  <QrCode className="w-8 h-8 text-slate-400" />
                </div>
              </div>
              <div className="absolute top-3 left-3 w-6 h-6 border-t-3 border-l-3 border-blue-500 rounded-tl-lg" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-3 border-r-3 border-blue-500 rounded-tr-lg" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-3 border-l-3 border-blue-500 rounded-bl-lg" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-3 border-r-3 border-blue-500 rounded-br-lg" />
            </div>

            <div className="text-center max-w-xs">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">
                Scan Kartu Ujian
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Arahkan kamera ke QR code pada kartu ujian Anda untuk masuk secara otomatis
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-medium text-amber-700">
                  Fitur scan QR akan tersedia segera
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 w-full">
              <button
                type="button"
                onClick={() => setActiveTab("manual")}
                className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
              >
                <span>Atau masuk dengan NISN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manual" className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nisn" className="text-sm font-medium text-slate-700">
                NISN
              </Label>
              <Input
                id="nisn"
                type="text"
                placeholder="Masukkan NISN Anda"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                disabled={isLoading}
                className="h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-11 pr-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kode_ujian" className="text-sm font-medium text-slate-700">
                Kode Ujian
              </Label>
              <Input
                id="kode_ujian"
                type="text"
                placeholder="Masukkan kode ujian"
                value={kodeUjianInput}
                onChange={(e) => setKodeUjianInput(e.target.value.toUpperCase())}
                disabled={isLoading}
                className="h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all uppercase"
              />
              <p className="text-xs text-slate-400">
                Kode ujian tertera pada kartu ujian Anda
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-11 mt-4 text-white font-semibold shadow-lg shadow-blue-500/25 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Memuat...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Masuk Ujian
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-400">
          Masuk ke ujian online <span className="font-medium text-slate-500">{schoolName}</span>
        </p>
      </div>
    </div>
  )
}
