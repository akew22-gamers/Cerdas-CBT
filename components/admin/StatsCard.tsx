import * as React from "react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  trend?: {
    value: number
    isPositive: boolean
  }
  highlight?: boolean
  gradient?: string
  className?: string
}

export function StatsCard({ icon, label, value, trend, highlight, gradient, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm",
        "flex flex-col justify-center gap-3",
        "hover:shadow-md hover:border-slate-300 transition-all duration-200",
        highlight && "ring-1 ring-amber-200/50",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          gradient ? `bg-gradient-to-br ${gradient} text-white shadow-lg` : "bg-slate-100 text-slate-600"
        )}>
          {icon}
        </div>
        <span className="text-sm font-medium text-slate-500">
          {label}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-slate-900">
          {value}
        </span>
        {trend && (
          <span className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full",
            trend.isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
          )}>
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  )
}
