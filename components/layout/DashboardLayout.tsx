"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

type UserRole = "super_admin" | "guru" | "siswa"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: {
    id?: string
    nama: string | null
    username?: string
    role: string
    nisn?: string
  }
  className?: string
}

function getUserRole(role: string): UserRole {
  if (role === "super_admin") return "super_admin"
  if (role === "guru") return "guru"
  return "siswa"
}

export function DashboardLayout({ children, user, className }: DashboardLayoutProps) {
  const role = getUserRole(user.role)

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar role={role} />
      
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Header user={user} />
        
        <main className={cn("flex-1 bg-slate-50 p-4 lg:p-8 overflow-y-auto", className)}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}