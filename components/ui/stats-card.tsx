/**
 * StatsCard Component - Mobile Optimized
 * Consolidated stats card with consistent design across all dashboards
 * @see {@link ../../lib/theme} for design tokens
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface StatsCardProps {
  /** Icon element (Lucide icon recommended) */
  icon: React.ReactNode
  /** Label text for the stat */
  label: string
  /** Stat value (string or number) */
  value: string | number
  /** Optional trend indicator with percentage */
  trend?: {
    value: number
    isPositive: boolean
  }
  /** Optional gradient for icon background (e.g., "from-blue-500 to-indigo-600") */
  gradient?: string
  /** Optional highlight ring (amber) */
  highlight?: boolean
  /** Additional CSS classes */
  className?: string
  /** On click handler (makes card clickable) */
  onClick?: () => void
}

export function StatsCard({
  icon,
  label,
  value,
  trend,
  gradient,
  highlight,
  className,
  onClick,
}: StatsCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        // Base card styling - consistent with theme
        'bg-white rounded-xl border border-slate-200/80 shadow-sm',
        
        // Spacing - mobile optimized
        'p-4 sm:p-6',
        
        // Layout
        'flex flex-col justify-center gap-2 sm:gap-3',
        
        // Interactive states
        onClick && 'cursor-pointer',
        'hover:shadow-md hover:border-slate-300 transition-all duration-200',
        onClick && 'active:scale-[0.98]',
        
        // Highlight state
        highlight && 'ring-1 ring-amber-200/50',
        
        className
      )}
    >
      {/* Icon + Label Row */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Icon with optional gradient */}
        <div
          className={cn(
            'p-1.5 sm:p-2 rounded-lg shrink-0',
            gradient
              ? `bg-gradient-to-br ${gradient} text-white shadow-lg`
              : 'bg-slate-100 text-slate-600'
          )}
        >
          {icon}
        </div>
        
        {/* Label - readable on mobile */}
        <span className="text-xs sm:text-sm font-medium text-slate-500 line-clamp-2">
          {label}
        </span>
      </div>

      {/* Value + Trend Row */}
      <div className="flex items-end justify-between gap-2">
        {/* Value - Large and bold */}
        <span className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">
          {value}
        </span>
        
        {/* Trend indicator (if provided) */}
        {trend && (
          <span
            className={cn(
              'shrink-0 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap',
              trend.isPositive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            )}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * StatsCardSkeleton - Loading state for StatsCard
 * Usage: Show while fetching dashboard data
 */
export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-6 animate-pulse">
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 rounded-lg" />
        <div className="flex-1">
          <div className="h-3 sm:h-4 bg-slate-200 rounded w-3/4" />
        </div>
      </div>
      <div className="h-7 sm:h-9 bg-slate-200 rounded w-1/2" />
    </div>
  )
}
