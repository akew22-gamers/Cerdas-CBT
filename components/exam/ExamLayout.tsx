'use client'

import { useEffect, useState, ReactNode, useCallback } from 'react'
import Image from 'next/image'

interface ExamLayoutProps {
  children: ReactNode
  timer: ReactNode
  progress: string
  onSubmit: () => void
  onFullscreenExit: () => void
}

export function ExamLayout({
  children,
  timer,
  progress,
  onSubmit,
  onFullscreenExit
}: ExamLayoutProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(true)
  const [examEnded, setExamEnded] = useState(false)

  const enterFullscreen = useCallback(async () => {
    try {
      const elem = document.documentElement
      if (!document.fullscreenElement) {
        await elem.requestFullscreen()
        setIsFullscreen(true)
        setShowFullscreenPrompt(false)
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
      setShowFullscreenPrompt(false)
    }
  }, [])

  const skipFullscreen = useCallback(() => {
    setShowFullscreenPrompt(false)
  }, [])

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (err) {
      console.error('Exit fullscreen error:', err)
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      const wasFullscreen = isFullscreen
      const nowFullscreen = !!document.fullscreenElement
      setIsFullscreen(nowFullscreen)
      
      if (wasFullscreen && !nowFullscreen && !examEnded) {
        onFullscreenExit()
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [isFullscreen, onFullscreenExit, examEnded])

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
      if (e.key === 'Escape' && isFullscreen && !examEnded) {
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
  }, [isFullscreen, examEnded])

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

  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {showFullscreenPrompt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Mode Fullscreen</h2>
            <p className="text-gray-600 mb-6">
              Untuk keamanan ujian, disarankan masuk ke mode fullscreen. 
              Keluar dari fullscreen akan tercatat sebagai pelanggaran.
            </p>
            <div className="space-y-3">
              <button
                onClick={enterFullscreen}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Masuk Fullscreen (Disarankan)
              </button>
              <button
                onClick={skipFullscreen}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Lanjutkan Tanpa Fullscreen
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logo_kemendikdasmen.svg"
                  alt="Logo Kemendikdasmen"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">Ujian Berbasis Komputer</h1>
                <p className="text-xs text-gray-500">Cerdas-CBT</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-0.5">Waktu Tersisa</p>
                {timer}
              </div>
              <div className="text-center hidden sm:block">
                <p className="text-xs text-gray-500 mb-0.5">Progress</p>
                <p className="text-sm font-semibold text-gray-900">{progress}</p>
              </div>
              <button
                onClick={onSubmit}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Kirim Jawaban
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}