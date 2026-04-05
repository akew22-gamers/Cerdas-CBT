/**
 * Skeleton Component - Loading State Placeholder
 * @see {@link ../lib/theme} for design tokens
 * 
 * Usage:
 * <Skeleton className="h-4 w-full" />
 * <Skeleton className="w-10 h-10 rounded-full" />
 */

import { cn } from '@/lib/utils'
import * as React from 'react'

export interface SkeletonProps {
  className?: string
  variant?: 'text' | 'text-sm' | 'title' | 'circle' | 'card' | 'default'
  animated?: boolean
}

export function Skeleton({ 
  className, 
  variant = 'default',
  animated = true,
}: SkeletonProps) {
  const baseStyles = 'bg-slate-200 relative overflow-hidden'
  
  const variantStyles = {
    default: '',
    text: 'h-4 w-full',
    'text-sm': 'h-3 w-2/3',
    title: 'h-6 w-3/4',
    circle: 'rounded-full',
    card: 'bg-white rounded-xl border border-slate-200/80 p-4',
  }
  
  const animationStyles = animated ? 'animate-pulse' : ''
  
  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        variant === 'default' && 'rounded',
        animationStyles,
        className
      )}
    />
  )
}

/**
 * SkeletonText - Pre-configured text line skeleton
 */
export function SkeletonText({ 
  lines = 1, 
  className,
  animated = true,
}: { 
  lines?: number
  className?: string
  animated?: boolean
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          variant={i === 0 ? 'text' : 'text-sm'}
          animated={animated}
          className={i === lines - 1 ? 'w-3/4' : undefined}
        />
      ))}
    </div>
  )
}

/**
 * SkeletonAvatar - Circular skeleton for avatars
 */
export function SkeletonAvatar({ 
  size = 'md',
  className,
  animated = true,
}: { 
  size?: 'sm' | 'md' | 'lg'
  className?: string
  animated?: boolean
}) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }
  
  return (
    <Skeleton 
      variant="circle" 
      className={cn(sizes[size], className)}
      animated={animated}
    />
  )
}

/**
 * SkeletonCard - Full card loading state
 */
export function SkeletonCard({ 
  className, 
  animated = true,
}: { 
  className?: string
  animated?: boolean
}) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200/80 p-4 space-y-3', className)}>
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="w-10 h-10" animated={animated} />
        <div className="flex-1 space-y-1">
          <Skeleton variant="text" className="w-1/2" animated={animated} />
          <Skeleton variant="text-sm" animated={animated} />
        </div>
      </div>
      <Skeleton variant="text" className="w-3/4" animated={animated} />
    </div>
  )
}

/**
 * SkeletonTable - Table loading state
 */
export function SkeletonTable({ 
  rows = 5, 
  columns = 4,
  className,
  animated = true,
}: { 
  rows?: number
  columns?: number
  className?: string
  animated?: boolean
}) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200/80 overflow-hidden', className)}>
      {/* Table Header */}
      <div className="bg-slate-50/50 border-b border-slate-200/80 p-3">
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} variant="text-sm" animated={animated} className="w-2/3" />
          ))}
        </div>
      </div>
      
      {/* Table Body */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-3">
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton 
                  key={colIndex} 
                  variant={colIndex === 0 ? 'text' : 'text-sm'}
                  animated={animated}
                  className={colIndex === columns - 1 ? 'w-1/2 justify-self-end' : undefined}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * SkeletonGrid - Grid of cards loading state
 */
export function SkeletonGrid({ 
  count = 4,
  columns = 'grid-cols-2 lg:grid-cols-4',
  className,
  animated = true,
}: { 
  count?: number
  columns?: string
  className?: string
  animated?: boolean
}) {
  return (
    <div className={cn('grid gap-3 sm:gap-4', columns, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} animated={animated} />
      ))}
    </div>
  )
}
