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
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Avatar, 
  AvatarFallback 
} from "@/components/ui/avatar"
import { 
  User, 
  Mail, 
  Shield, 
  KeyRound, 
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
    id: string
    username: string
    nama: string | null
    role: 'super_admin' | 'guru' | 'siswa'
    nisn?: string
  }
}

function getInitials(nama: string | null, username?: string): string {
  const displayName = nama || username || "User"
  const words = displayName.trim().split(" ")
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase()
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

function getRoleLabel(role: string): string {
  const roleMap: Record<string, string> = {
    super_admin: "Super Admin",
    guru: "Guru",
    siswa: "Siswa",
  }
  return roleMap[role] || role
}

function getRoleColor(role: string): string {
  const colorMap: Record<string, string> = {
    super_admin: "bg-gradient-to-br from-violet-500 to-purple-600",
    guru: "bg-gradient-to-br from-blue-500 to-indigo-600",
    siswa: "bg-gradient-to-br from-emerald-500 to-teal-600",
  }
  return colorMap[role] || "bg-slate-500"
}

export function ProfileDialog({ open, onOpenChange, user }: ProfileDialogProps) {
  const [isChangingPassword, setIsChangingPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [showOldPassword, setShowOldPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [passwordForm, setPasswordForm] = React.useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  })

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("Password baru tidak cocok")
      return
    }

    if (passwordForm.new_password.length < 6) {
      toast.error("Password baru minimal 6 karakter")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_password: passwordForm.old_password,
          new_password: passwordForm.new_password
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || "Gagal mengubah password")
      }

      toast.success("Password berhasil diubah")
      setPasswordForm({ old_password: "", new_password: "", confirm_password: "" })
      setIsChangingPassword(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Gagal mengubah password"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-violet-500" />
            Profil Saya
          </DialogTitle>
          <DialogDescription>
            Informasi akun dan pengaturan keamanan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4">
            <Avatar className={cn("h-16 w-16", getRoleColor(user.role))}>
              <AvatarFallback className="text-white text-lg font-semibold">
                {getInitials(user.nama, user.username)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-slate-900">
                {user.nama || user.username || "User"}
              </h3>
              <p className="text-sm text-slate-500">{getRoleLabel(user.role)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Username</p>
                  <p className="font-medium text-slate-900">{user.username}</p>
                </div>
              </div>

              {user.nama && (
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Nama Lengkap</p>
                    <p className="font-medium text-slate-900">{user.nama}</p>
                  </div>
                </div>
              )}

              {user.nisn && (
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">NISN</p>
                    <p className="font-medium text-slate-900">{user.nisn}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Role</p>
                  <p className="font-medium text-slate-900">{getRoleLabel(user.role)}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              {!isChangingPassword ? (
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => setIsChangingPassword(true)}
                >
                  <KeyRound className="h-4 w-4" />
                  Ubah Password
                </Button>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    <KeyRound className="h-4 w-4 text-violet-500" />
                    Ubah Password
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="old_password">Password Lama</Label>
                      <div className="relative">
                        <Input
                          id="old_password"
                          type={showOldPassword ? "text" : "password"}
                          value={passwordForm.old_password}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, old_password: e.target.value }))}
                          placeholder="Masukkan password lama"
                          required
                          disabled={isLoading}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new_password">Password Baru</Label>
                      <div className="relative">
                        <Input
                          id="new_password"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordForm.new_password}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))}
                          placeholder="Minimal 6 karakter"
                          required
                          disabled={isLoading}
                          minLength={6}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Konfirmasi Password</Label>
                      <Input
                        id="confirm_password"
                        type="password"
                        value={passwordForm.confirm_password}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm_password: e.target.value }))}
                        placeholder="Ulangi password baru"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsChangingPassword(false)
                        setPasswordForm({ old_password: "", new_password: "", confirm_password: "" })
                      }}
                      disabled={isLoading}
                    >
                      Batal
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Simpan
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}