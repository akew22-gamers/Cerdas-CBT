'use client'

import { useEffect, useState, ReactNode, useCallback } from 'react'
import Image from 'next/image'

interface ExamLayoutProps {
  children: ReactNode
  timer: ReactNode
  progress: string
  onSubmit: () => void
  onFullscreenExit: () => void
  siswaInfo?: {
    nama: string
    nisn: string
  }
}

export function ExamLayout({
  children,
  timer,
  progress,
  onSubmit,
  onFullscreenExit,
  siswaInfo
}: ExamLayoutProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null)

  const enterFullscreen = useCallback(async () => {
    if (!document.fullscreenElement && document.fullscreenEnabled) {
      try {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } catch (err) {
        console.error('Re-enter fullscreen error:', err)
      }
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      const wasFullscreen = isFullscreen
      const nowFullscreen = !!document.fullscreenElement
      setIsFullscreen(nowFullscreen)
      
      if (wasFullscreen && !nowFullscreen) {
        onFullscreenExit()
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [isFullscreen, onFullscreenExit])

  useEffect(() => {
    let wakeLockInstance: WakeLockSentinel | null = null
    
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then(lock => {
        wakeLockInstance = lock
        setWakeLock(lock)
      }).catch(console.error)
    }
    
    return () => {
      if (wakeLockInstance) {
        wakeLockInstance.release().catch(console.error)
      }
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault()
      }
      if (e.key === 'PrintScreen') {
        e.preventDefault()
      }
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('contextmenu', handleContextMenu)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Tab switch detected')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <Image
                  src="/images/logo_kemendikdasmen.svg"
                  alt="Logo Kemendikdasmen"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">Ujian Berbasis Komputer</h1>
                {siswaInfo ? (
                  <>
                    <p className="text-xs text-gray-500 truncate">{siswaInfo.nama}</p>
                    <p className="text-xs text-gray-400 truncate">NISN: {siswaInfo.nisn || '-'}</p>
                  </>
                ) : (
                  <p className="text-xs text-gray-500">Cerdas-CBT</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
              {!isFullscreen && document.fullscreenEnabled && (
                <button
                  onClick={enterFullscreen}
                  className="hidden sm:flex items-center gap-1 px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-medium rounded transition-colors"
                  title="Klik untuk masuk fullscreen"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Fullscreen
                </button>
              )}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-0.5 hidden sm:block">Waktu Tersisa</p>
                {timer}
              </div>
              <div className="text-center hidden md:block">
                <p className="text-xs text-gray-500 mb-0.5">Progress</p>
                <p className="text-sm font-semibold text-gray-900">{progress}</p>
              </div>
              <button
                onClick={onSubmit}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                Kirim Jawaban
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {children}
      </main>
    </div>
  )
}
