"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { StatsCard } from "@/components/admin/StatsCard"
import { PageHeader } from "@/components/layout/PageHeader"
import { ResetDataDialog } from "@/components/admin/ResetDataDialog"
import { Users, ClipboardList, FileCheck, BookOpen, UserPlus, Search, Settings, Sparkles, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DashboardStats {
  total_guru: number
  total_siswa: number
  total_ujian: number
  ujian_aktif: number
  recent_guru: Array<{
    id: string
    nama: string
    created_at: string
  }>
  recent_audit_logs: Array<{
    id: string
    role: string
    action: string
    entity_type: string | null
    details: any
    created_at: string
  }>
}

interface UserProfile {
  nama: string | null
  username?: string
  role: string
}

export default function AdminDashboard() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [user, setUser] = React.useState<UserProfile>({ nama: "Super Admin", role: "super_admin" })

  const fetchDashboardData = React.useCallback(async () => {
    try {
      setLoading(true)
      const [statsRes, meRes] = await Promise.all([
        fetch("/api/admin/dashboard"),
        fetch("/api/auth/me")
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        if (statsData.success) {
          setStats(statsData.data)
        }
      }

      if (meRes.ok) {
        const meData = await meRes.json()
        if (meData.success) {
          setUser(meData.data.user)
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date)
  }

  const formatAction = (action: string) => {
    const actionMap: Record<string, string> = {
      login: "Login",
      logout: "Logout",
      create: "Membuat",
      update: "Memperbarui",
      delete: "Menghapus",
      submit: "Mensubmit"
    }
    return actionMap[action] || action
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6 sm:space-y-8">
        <PageHeader
          title="Dashboard Super Admin"
          description="Kelola users, monitoring aktivitas, dan pengaturan sistem"
        />

        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
            label="Total Guru"
            value={loading ? "-" : stats?.total_guru ?? 0}
            trend={{ value: 12, isPositive: true }}
            gradient="from-violet-500 to-purple-600"
          />
          <StatsCard
            icon={<ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />}
            label="Total Siswa"
            value={loading ? "-" : stats?.total_siswa ?? 0}
            trend={{ value: 8, isPositive: true }}
            gradient="from-blue-500 to-indigo-600"
          />
          <StatsCard
            icon={<FileCheck className="w-4 h-4 sm:w-5 sm:h-5" />}
            label="Total Ujian"
            value={loading ? "-" : stats?.total_ujian ?? 0}
            trend={{ value: 5, isPositive: true }}
            gradient="from-emerald-500 to-teal-600"
          />
          <StatsCard
            icon={<BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />}
            label="Ujian Aktif"
            value={loading ? "-" : stats?.ujian_aktif ?? 0}
            highlight
            gradient="from-amber-500 to-orange-600"
          />
        </div>

        <Card className="border-slate-200/80 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
              <CardTitle className="text-base sm:text-lg font-semibold text-slate-900">
                Quick Actions
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/admin/guru/create">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3 sm:py-4 hover:bg-violet-50 hover:border-violet-200 group transition-all">
                  <div className="p-1.5 sm:p-2 bg-violet-100 rounded-lg group-hover:bg-violet-200 transition-colors">
                    <UserPlus className="w-4 h-4 text-violet-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 text-sm sm:text-base">Create Guru</p>
                    <p className="text-xs text-slate-500 hidden sm:block">Tambah guru baru</p>
                  </div>
                </Button>
              </Link>
              <Link href="/admin/audit">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3 sm:py-4 hover:bg-blue-50 hover:border-blue-200 group transition-all">
                  <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Search className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 text-sm sm:text-base">View Audit Log</p>
                    <p className="text-xs text-slate-500 hidden sm:block">Monitoring aktivitas</p>
                  </div>
                </Button>
              </Link>
              <Link href="/admin/sekolah">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3 sm:py-4 hover:bg-emerald-50 hover:border-emerald-200 group transition-all">
                  <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                    <Settings className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 text-sm sm:text-base">School Settings</p>
                    <p className="text-xs text-slate-500 hidden sm:block">Identitas sekolah</p>
                  </div>
                </Button>
              </Link>
              <ResetDataDialog onDataReset={fetchDashboardData} />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                Guru Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center text-slate-500 py-6 sm:py-8 text-sm">Memuat...</div>
              ) : stats?.recent_guru && stats.recent_guru.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {stats.recent_guru.map((guru) => (
                    <div
                      key={guru.id}
                      className="flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {guru.nama?.substring(0, 2).toUpperCase() || "GU"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">{guru.nama}</p>
                          <p className="text-xs text-slate-500 truncate">
                            Ditambahkan {formatDate(guru.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-500 py-6 sm:py-8 text-sm">
                  Belum ada guru terdaftar
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                Aktivitas Terakhir
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center text-slate-500 py-6 sm:py-8 text-sm">Memuat...</div>
              ) : stats?.recent_audit_logs && stats.recent_audit_logs.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {stats.recent_audit_logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start justify-between p-3 sm:p-4 hover:bg-slate-50/50 transition-colors gap-2"
                    >
                      <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                        <div className={`
                          h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center text-white text-xs font-semibold flex-shrink-0
                          ${log.role === 'super_admin' ? 'bg-violet-500' : log.role === 'guru' ? 'bg-blue-500' : 'bg-emerald-500'}
                        `}>
                          {log.role === 'super_admin' ? 'SA' : log.role === 'guru' ? 'G' : 'S'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 text-xs sm:text-sm">
                            {formatAction(log.action)} {log.entity_type || "-"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {log.role === "super_admin" ? "Super Admin" : log.role === "guru" ? "Guru" : "Siswa"}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 flex-shrink-0">
                        {formatDate(log.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-500 py-6 sm:py-8 text-sm">
                  Belum ada aktivitas
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
