"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Settings, 
  Moon, 
  Sun, 
  Globe, 
  Bell, 
  Monitor,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ThemeSetting = 'light' | 'dark' | 'system'
type LanguageSetting = 'id' | 'en'

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [theme, setTheme] = React.useState<ThemeSetting>('light')
  const [language, setLanguage] = React.useState<LanguageSetting>('id')
  const [notifications, setNotifications] = React.useState(true)

  const handleSave = () => {
    localStorage.setItem('settings', JSON.stringify({ theme, language, notifications }))
    toast.success("Pengaturan berhasil disimpan")
    onOpenChange(false)
  }

  React.useEffect(() => {
    const saved = localStorage.getItem('settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.theme) setTheme(parsed.theme)
        if (parsed.language) setLanguage(parsed.language)
        if (parsed.notifications !== undefined) setNotifications(parsed.notifications)
      } catch {
        // ignore
      }
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-violet-500" />
            Pengaturan
          </DialogTitle>
          <DialogDescription>
            Sesuaikan preferensi aplikasi Anda
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-900 flex items-center gap-2 mb-3">
                <Sun className="h-4 w-4 text-amber-500" />
                Tema Aplikasi
              </label>
              <div className="grid grid-cols-3 gap-2">
                <ThemeOption
                  icon={Sun}
                  label="Terang"
                  value="light"
                  selected={theme === 'light'}
                  onClick={() => setTheme('light')}
                />
                <ThemeOption
                  icon={Moon}
                  label="Gelap"
                  value="dark"
                  selected={theme === 'dark'}
                  onClick={() => setTheme('dark')}
                />
                <ThemeOption
                  icon={Monitor}
                  label="Sistem"
                  value="system"
                  selected={theme === 'system'}
                  onClick={() => setTheme('system')}
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="text-sm font-medium text-slate-900 flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-blue-500" />
                Bahasa
              </label>
              <div className="grid grid-cols-2 gap-2">
                <LanguageOption
                  label="Bahasa Indonesia"
                  value="id"
                  selected={language === 'id'}
                  onClick={() => setLanguage('id')}
                />
                <LanguageOption
                  label="English"
                  value="en"
                  selected={language === 'en'}
                  onClick={() => setLanguage('en')}
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="text-sm font-medium text-slate-900 flex items-center gap-2 mb-3">
                <Bell className="h-4 w-4 text-emerald-500" />
                Notifikasi
              </label>
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <p className="font-medium text-slate-900 text-sm">Aktifkan Notifikasi</p>
                  <p className="text-xs text-slate-500">Terima pemberitahuan untuk aktivitas penting</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    notifications ? "bg-violet-500" : "bg-slate-300"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform",
                      notifications && "translate-x-5"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          >
            <Check className="h-4 w-4 mr-2" />
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ThemeOption({
  icon: Icon,
  label,
  value,
  selected,
  onClick
}: {
  icon: any
  label: string
  value: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
        selected 
          ? "border-violet-500 bg-violet-50 text-violet-700" 
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      )}
    >
      <Icon className={cn("h-5 w-5", selected ? "text-violet-500" : "text-slate-400")} />
      <span className="text-xs font-medium">{label}</span>
      {selected && <Check className="h-3 w-3 text-violet-500 absolute top-1 right-1" />}
    </button>
  )
}

function LanguageOption({
  label,
  value,
  selected,
  onClick
}: {
  label: string
  value: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all",
        selected 
          ? "border-violet-500 bg-violet-50 text-violet-700" 
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      )}
    >
      <span className="text-sm font-medium">{label}</span>
      {selected && <Check className="h-4 w-4 text-violet-500" />}
    </button>
  )
}