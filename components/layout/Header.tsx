'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, User, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ProfileDialog } from './ProfileDialog'
import { colors } from '@/lib/theme'

interface HeaderProps {
  user: {
    nama: string | null
    username?: string
    role: string
    id?: string
    nisn?: string
  }
  className?: string
}

function getInitials(nama: string | null, username?: string): string {
  const displayName = nama || username || 'User'
  const words = displayName.trim().split(' ')
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase()
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

function getRoleLabel(role: string): string {
  const roleMap: Record<string, string> = {
    super_admin: 'Super Admin',
    guru: 'Guru',
    siswa: 'Siswa',
  }
  return roleMap[role] || role
}

function getRoleColor(role: string): string {
  const colorMap: Record<string, string> = {
    super_admin: 'bg-violet-500 text-white',
    guru: 'bg-blue-500 text-white',
    siswa: 'bg-emerald-500 text-white',
  }
  return colorMap[role] || 'bg-slate-500 text-white'
}

export function Header({ user, className }: HeaderProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [showProfile, setShowProfile] = React.useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      if (response.ok) {
        router.push('/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <header
        className={cn(
          // Base styling
          'bg-white border-b border-slate-200/80 h-14 sm:h-16 flex items-center justify-end',
          'px-3 sm:px-4 lg:px-6 w-full flex-shrink-0',
          'shadow-sm shadow-slate-100/50',
          className
        )}
      >
        <DropdownMenu>
          {/* Trigger - Mobile compact, desktop full */}
          <DropdownMenuTrigger className={cn(
            'flex items-center gap-2 sm:gap-3 cursor-pointer',
            'hover:bg-slate-50 px-2.5 sm:px-3 py-2 rounded-xl',
            'transition-all duration-200 group',
            'active:scale-95',
            'min-h-[44px]' // Touch target
          )}>
            {/* Avatar - Smaller on mobile */}
            <Avatar className={cn('h-8 w-8 sm:h-9 sm:w-9', getRoleColor(user.role))}>
              <AvatarFallback className={cn(getRoleColor(user.role), 'text-xs sm:text-sm font-semibold')}>
                {getInitials(user.nama, user.username)}
              </AvatarFallback>
            </Avatar>
            
            {/* User Info - Hidden on mobile, shown on sm+ */}
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-900 leading-tight max-w-[150px] truncate">
                {user.nama || user.username || 'User'}
              </p>
              <p className="text-xs text-slate-500 leading-tight flex items-center justify-end gap-1">
                {getRoleLabel(user.role)}
                <ChevronDown className="w-3 h-3 group-data-[state=open]:rotate-180 transition-transform" />
              </p>
            </div>
          </DropdownMenuTrigger>

          {/* Dropdown Content */}
          <DropdownMenuContent 
            align="end" 
            className="w-64 sm:w-72"
            sideOffset={8}
          >
            {/* Profile Header */}
            <DropdownMenuLabel className="font-normal p-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Avatar className={cn('h-11 w-11', getRoleColor(user.role))}>
                  <AvatarFallback className={cn(getRoleColor(user.role), 'text-sm font-semibold')}>
                    {getInitials(user.nama, user.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {user.nama || user.username || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {getRoleLabel(user.role)}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            {/* Menu Items */}
            <div className="py-2">
              <DropdownMenuItem
                className={cn(
                  'cursor-pointer py-2.5 px-3 hover:bg-slate-50',
                  'min-h-[44px]' // Touch target
                )}
                onClick={() => setShowProfile(true)}
              >
                <User className="mr-3 h-4 w-4 text-slate-500" />
                <span>Profil</span>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator />

            {/* Logout */}
            <div className="py-2">
              <DropdownMenuItem
                className={cn(
                  'cursor-pointer py-2.5 px-3',
                  'text-red-600 focus:text-red-600 focus:bg-red-50 hover:bg-red-50',
                  'min-h-[44px]' // Touch target
                )}
                onClick={handleLogout}
                disabled={isLoading}
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>{isLoading ? 'Keluar...' : 'Keluar'}</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <ProfileDialog
        open={showProfile}
        onOpenChange={setShowProfile}
        user={{
          id: user.id || '',
          username: user.username || '',
          nama: user.nama,
          role: user.role as 'super_admin' | 'guru' | 'siswa',
          nisn: user.nisn
        }}
      />
    </>
  )
}
