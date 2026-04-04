"use client"

import * as React from "react"

type Language = "id" | "en"

type LanguageProviderProps = {
  children: React.ReactNode
  defaultLanguage?: Language
  storageKey?: string
}

type LanguageProviderState = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  id: {
    "common.login": "Masuk",
    "common.logout": "Keluar",
    "common.save": "Simpan",
    "common.cancel": "Batal",
    "common.delete": "Hapus",
    "common.edit": "Edit",
    "common.create": "Buat",
    "common.search": "Cari",
    "common.filter": "Filter",
    "common.loading": "Memuat...",
    "common.success": "Berhasil",
    "common.error": "Gagal",
    "common.confirm": "Konfirmasi",
    "common.yes": "Ya",
    "common.no": "Tidak",
    "common.close": "Tutup",
    "common.back": "Kembali",
    "common.next": "Selanjutnya",
    "common.previous": "Sebelumnya",
    
    "nav.dashboard": "Dashboard",
    "nav.guru": "Guru",
    "nav.siswa": "Siswa",
    "nav.ujian": "Ujian",
    "nav.soal": "Soal",
    "nav.kelas": "Kelas",
    "nav.hasil": "Hasil",
    "nav.settings": "Pengaturan",
    "nav.profile": "Profil",
    
    "settings.title": "Pengaturan",
    "settings.theme": "Tema Aplikasi",
    "settings.theme.light": "Terang",
    "settings.theme.dark": "Gelap",
    "settings.theme.system": "Sistem",
    "settings.language": "Bahasa",
    "settings.notifications": "Notifikasi",
    "settings.notifications.description": "Terima pemberitahuan untuk aktivitas penting",
    
    "profile.title": "Profil Saya",
    "profile.changePassword": "Ubah Password",
    "profile.oldPassword": "Password Lama",
    "profile.newPassword": "Password Baru",
    "profile.confirmPassword": "Konfirmasi Password",
    
    "auth.login.title": "Masuk ke Akun",
    "auth.login.username": "Username",
    "auth.login.password": "Password",
    "auth.login.remember": "Ingat saya",
    "auth.login.forgot": "Lupa password?",
    
    "dashboard.welcome": "Selamat Datang",
    "dashboard.totalGuru": "Total Guru",
    "dashboard.totalSiswa": "Total Siswa",
    "dashboard.totalUjian": "Total Ujian",
    "dashboard.ujianAktif": "Ujian Aktif",
    
    "ujian.status.aktif": "Aktif",
    "ujian.status.nonaktif": "Nonaktif",
    "ujian.duration": "Durasi",
    "ujian.questions": "Soal",
    "ujian.start": "Mulai",
    "ujian.submit": "Submit",
    
    "notifications.enabled": "Notifikasi diaktifkan",
    "notifications.disabled": "Notifikasi dinonaktifkan",
    "notifications.permissionDenied": "Izin notifikasi ditolak",
    "notifications.permissionRequired": "Izinkan notifikasi di browser Anda",
    
    "theme.changed": "Tema berhasil diubah",
    "language.changed": "Bahasa berhasil diubah",
  },
  en: {
    "common.login": "Login",
    "common.logout": "Logout",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.create": "Create",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.loading": "Loading...",
    "common.success": "Success",
    "common.error": "Error",
    "common.confirm": "Confirm",
    "common.yes": "Yes",
    "common.no": "No",
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    
    "nav.dashboard": "Dashboard",
    "nav.guru": "Teachers",
    "nav.siswa": "Students",
    "nav.ujian": "Exams",
    "nav.soal": "Questions",
    "nav.kelas": "Classes",
    "nav.hasil": "Results",
    "nav.settings": "Settings",
    "nav.profile": "Profile",
    
    "settings.title": "Settings",
    "settings.theme": "App Theme",
    "settings.theme.light": "Light",
    "settings.theme.dark": "Dark",
    "settings.theme.system": "System",
    "settings.language": "Language",
    "settings.notifications": "Notifications",
    "settings.notifications.description": "Receive notifications for important activities",
    
    "profile.title": "My Profile",
    "profile.changePassword": "Change Password",
    "profile.oldPassword": "Old Password",
    "profile.newPassword": "New Password",
    "profile.confirmPassword": "Confirm Password",
    
    "auth.login.title": "Login to Account",
    "auth.login.username": "Username",
    "auth.login.password": "Password",
    "auth.login.remember": "Remember me",
    "auth.login.forgot": "Forgot password?",
    
    "dashboard.welcome": "Welcome",
    "dashboard.totalGuru": "Total Teachers",
    "dashboard.totalSiswa": "Total Students",
    "dashboard.totalUjian": "Total Exams",
    "dashboard.ujianAktif": "Active Exams",
    
    "ujian.status.aktif": "Active",
    "ujian.status.nonaktif": "Inactive",
    "ujian.duration": "Duration",
    "ujian.questions": "Questions",
    "ujian.start": "Start",
    "ujian.submit": "Submit",
    
    "notifications.enabled": "Notifications enabled",
    "notifications.disabled": "Notifications disabled",
    "notifications.permissionDenied": "Notification permission denied",
    "notifications.permissionRequired": "Allow notifications in your browser",
    
    "theme.changed": "Theme changed successfully",
    "language.changed": "Language changed successfully",
  },
}

const LanguageProviderContext = React.createContext<LanguageProviderState | undefined>(
  undefined
)

export function LanguageProvider({
  children,
  defaultLanguage = "id",
  storageKey = "cbt-language",
  ...props
}: LanguageProviderProps) {
  const [language, setLanguageState] = React.useState<Language>(defaultLanguage)

  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Language | null
    if (stored && (stored === "id" || stored === "en")) {
      setLanguageState(stored)
    }
  }, [storageKey])

  const setLanguage = React.useCallback(
    (newLanguage: Language) => {
      localStorage.setItem(storageKey, newLanguage)
      setLanguageState(newLanguage)
    },
    [storageKey]
  )

  const t = React.useCallback(
    (key: string): string => {
      return translations[language][key] || key
    },
    [language]
  )

  const value = React.useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  )

  return (
    <LanguageProviderContext.Provider {...props} value={value}>
      {children}
    </LanguageProviderContext.Provider>
  )
}

export function useLanguage() {
  const context = React.useContext(LanguageProviderContext)

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }

  return context
}

export { translations }