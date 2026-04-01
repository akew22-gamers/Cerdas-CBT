"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  School,
  GraduationCap,
  BookOpen,
  FileQuestion,
  FileText,
  History,
  Menu,
  X,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type UserRole = "super_admin" | "guru" | "siswa"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface NavSection {
  title?: string
  items: NavItem[]
}

const navigationConfig: Record<UserRole, NavSection[]> = {
  super_admin: [
    {
      items: [
        { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
      ],
    },
    {
      title: "Manajemen",
      items: [
        { label: "Guru Management", href: "/admin/guru", icon: <Users className="w-5 h-5" /> },
        { label: "Audit Log", href: "/admin/audit-log", icon: <ClipboardList className="w-5 h-5" /> },
        { label: "Identitas Sekolah", href: "/admin/sekolah", icon: <School className="w-5 h-5" /> },
      ],
    },
  ],
  guru: [
    {
      items: [
        { label: "Dashboard", href: "/guru", icon: <LayoutDashboard className="w-5 h-5" /> },
      ],
    },
    {
      title: "Manajemen",
      items: [
        { label: "Kelas", href: "/guru/kelas", icon: <School className="w-5 h-5" /> },
        { label: "Siswa", href: "/guru/siswa", icon: <GraduationCap className="w-5 h-5" /> },
        { label: "Ujian", href: "/guru/ujian", icon: <BookOpen className="w-5 h-5" /> },
        { label: "Soal", href: "/guru/soal", icon: <FileQuestion className="w-5 h-5" /> },
        { label: "Hasil", href: "/guru/hasil", icon: <FileText className="w-5 h-5" /> },
      ],
    },
  ],
  siswa: [
    {
      items: [
        { label: "Dashboard", href: "/siswa", icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: "Ujian", href: "/siswa/ujian", icon: <BookOpen className="w-5 h-5" /> },
        { label: "Riwayat", href: "/siswa/riwayat", icon: <History className="w-5 h-5" /> },
      ],
    },
  ],
}

const roleColors: Record<UserRole, { gradient: string; accent: string }> = {
  super_admin: { gradient: "from-violet-500 to-purple-600", accent: "violet" },
  guru: { gradient: "from-blue-500 to-indigo-600", accent: "blue" },
  siswa: { gradient: "from-emerald-500 to-teal-600", accent: "emerald" },
}

interface SidebarProps {
  role: UserRole
  className?: string
}

export function Sidebar({ role, className }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const navSections = navigationConfig[role]
  const colors = roleColors[role]

  const isActive = (href: string) => {
    if (href === "/admin" || href === "/guru" || href === "/siswa") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="bg-white border-slate-200 shadow-sm hover:bg-slate-50"
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-slate-700" />
          ) : (
            <Menu className="h-5 w-5 text-slate-700" />
          )}
        </Button>
      </div>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "w-64 bg-white border-r border-slate-200/80 min-h-screen flex flex-col",
          "fixed lg:static inset-y-0 left-0 z-40",
          "transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        <div className="flex items-center gap-3 p-5 border-b border-slate-200/80">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-xl blur-md opacity-60`} />
            <div className="relative h-9 w-9 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100">
              <img
                src="/images/logo_kemendikdasmen.svg"
                alt="Logo"
                className="h-6 w-6"
              />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 leading-none">Cerdas-CBT</h1>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Platform Ujian</p>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {section.title && (
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-5">
                  {section.title}
                </p>
              )}
              <div className="space-y-1 px-3">
                {section.items.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                        active
                          ? `bg-gradient-to-r ${colors.gradient} text-white shadow-md shadow-${colors.accent}-500/25`
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <span className={cn(
                        "w-5 h-5 transition-colors",
                        active ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                      )}>
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {active && (
                        <ChevronRight className="w-4 h-4 opacity-60" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200/80">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] text-slate-400 text-center font-medium">
              © 2026 Cerdas-CBT
            </p>
            <p className="text-[9px] text-slate-400 text-center">
              EAS Creative Studio
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
