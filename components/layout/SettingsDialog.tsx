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
  BellOff,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme/ThemeProvider"
import { useLanguage } from "@/components/language/LanguageProvider"
import { useNotifications } from "@/components/notifications/NotificationProvider"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { enabled: notificationsEnabled, toggle: toggleNotifications, permission } = useNotifications()

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    toast.success(t("theme.changed"))
  }

  const handleLanguageChange = (newLanguage: "id" | "en") => {
    setLanguage(newLanguage)
    toast.success(t("language.changed"))
  }

  const handleNotificationsToggle = async () => {
    await toggleNotifications()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-violet-500" />
            {t("settings.title")}
          </DialogTitle>
          <DialogDescription>
            {language === "id" 
              ? "Sesuaikan preferensi aplikasi Anda"
              : "Customize your app preferences"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-900 flex items-center gap-2 mb-3">
                <Sun className="h-4 w-4 text-amber-500" />
                {t("settings.theme")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <ThemeOption
                  icon={Sun}
                  label={t("settings.theme.light")}
                  value="light"
                  selected={theme === "light"}
                  onClick={() => handleThemeChange("light")}
                />
                <ThemeOption
                  icon={Moon}
                  label={t("settings.theme.dark")}
                  value="dark"
                  selected={theme === "dark"}
                  onClick={() => handleThemeChange("dark")}
                />
                <ThemeOption
                  icon={Monitor}
                  label={t("settings.theme.system")}
                  value="system"
                  selected={theme === "system"}
                  onClick={() => handleThemeChange("system")}
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="text-sm font-medium text-slate-900 flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-blue-500" />
                {t("settings.language")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <LanguageOption
                  label="Bahasa Indonesia"
                  flag="🇮🇩"
                  value="id"
                  selected={language === "id"}
                  onClick={() => handleLanguageChange("id")}
                />
                <LanguageOption
                  label="English"
                  flag="🇬🇧"
                  value="en"
                  selected={language === "en"}
                  onClick={() => handleLanguageChange("en")}
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="text-sm font-medium text-slate-900 flex items-center gap-2 mb-3">
                <Bell className="h-4 w-4 text-emerald-500" />
                {t("settings.notifications")}
              </label>
              <button
                onClick={handleNotificationsToggle}
                disabled={permission === "unsupported"}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                  notificationsEnabled 
                    ? "border-violet-200 bg-violet-50/50" 
                    : "border-slate-200 bg-slate-50/50",
                  permission === "unsupported" && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  {notificationsEnabled ? (
                    <Bell className="h-5 w-5 text-violet-500" />
                  ) : (
                    <BellOff className="h-5 w-5 text-slate-400" />
                  )}
                  <div className="text-left">
                    <p className="font-medium text-slate-900 text-sm">
                      {notificationsEnabled 
                        ? (language === "id" ? "Notifikasi Aktif" : "Notifications Enabled")
                        : (language === "id" ? "Notifikasi Nonaktif" : "Notifications Disabled")}
                    </p>
                    <p className="text-xs text-slate-500">
                      {t("settings.notifications.description")}
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    notificationsEnabled ? "bg-violet-500" : "bg-slate-300"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform",
                      notificationsEnabled && "translate-x-5"
                    )}
                  />
                </div>
              </button>
              {permission === "denied" && (
                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  <BellOff className="h-3 w-3" />
                  {t("notifications.permissionRequired")}
                </p>
              )}
              {permission === "unsupported" && (
                <p className="text-xs text-slate-500 mt-2">
                  {language === "id" 
                    ? "Browser tidak mendukung notifikasi" 
                    : "Browser does not support notifications"}
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={() => onOpenChange(false)}
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          >
            {t("common.close")}
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
        "relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
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
  flag,
  value,
  selected,
  onClick
}: {
  label: string
  flag: string
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
      <span className="text-lg">{flag}</span>
      <span className="text-sm font-medium">{label}</span>
      {selected && <Check className="h-4 w-4 text-violet-500" />}
    </button>
  )
}