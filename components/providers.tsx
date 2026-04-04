"use client"

import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { LanguageProvider } from "@/components/language/LanguageProvider"
import { NotificationProvider } from "@/components/notifications/NotificationProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="cbt-theme">
      <LanguageProvider defaultLanguage="id" storageKey="cbt-language">
        <NotificationProvider storageKey="cbt-notifications">
          {children}
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}