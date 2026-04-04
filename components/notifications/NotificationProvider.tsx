"use client"

import * as React from "react"

type NotificationState = {
  enabled: boolean
  permission: NotificationPermission | "unsupported"
  requestPermission: () => Promise<boolean>
  showNotification: (title: string, options?: NotificationOptions) => void
  toggle: () => Promise<void>
}

const NotificationContext = React.createContext<NotificationState | undefined>(
  undefined
)

export function NotificationProvider({
  children,
  storageKey = "cbt-notifications",
}: {
  children: React.ReactNode
  storageKey?: string
}) {
  const [enabled, setEnabled] = React.useState(false)
  const [permission, setPermission] = React.useState<NotificationPermission | "unsupported">("default")

  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored === "true") {
      setEnabled(true)
    }

    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission)
    } else {
      setPermission("unsupported")
    }
  }, [storageKey])

  const requestPermission = React.useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === "granted"
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return false
    }
  }, [])

  const showNotification = React.useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!enabled || permission !== "granted") {
        return
      }

      try {
        new Notification(title, {
          icon: "/logo.png",
          badge: "/logo.png",
          ...options,
        })
      } catch (error) {
        console.error("Error showing notification:", error)
      }
    },
    [enabled, permission]
  )

  const toggle = React.useCallback(async () => {
    if (!enabled) {
      const granted = await requestPermission()
      if (granted) {
        setEnabled(true)
        localStorage.setItem(storageKey, "true")
        showNotification("Notifikasi Diaktifkan", {
          body: "Anda akan menerima notifikasi untuk aktivitas penting",
        })
      }
    } else {
      setEnabled(false)
      localStorage.setItem(storageKey, "false")
    }
  }, [enabled, requestPermission, storageKey, showNotification])

  const value = React.useMemo(
    () => ({
      enabled,
      permission,
      requestPermission,
      showNotification,
      toggle,
    }),
    [enabled, permission, requestPermission, showNotification, toggle]
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = React.useContext(NotificationContext)

  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }

  return context
}