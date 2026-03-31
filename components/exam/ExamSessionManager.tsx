'use client'

import React, { useState, useCallback } from 'react'
import { useExamSession } from '@/lib/hooks/useExamSession'
import { toast } from 'sonner'
import { Clock, RotateCcw, Save } from 'lucide-react'

interface ExamSessionManagerProps {
  ujianId: string
  children: (props: {
    currentSoalIndex: number
    answers: Record<string, string>
    isLoading: boolean
    isRestored: boolean
    setCurrentSoalIndex: (index: number) => void
    setAnswer: (soalId: string, answer: string) => void
  }) => React.ReactNode
  onRestore?: (state: { currentSoalIndex: number; answers: Record<string, string> }) => void
  onAutoSave?: (state: { currentSoalIndex: number; answers: Record<string, string> }) => void
}

export function ExamSessionManager({
  ujianId,
  children,
  onRestore,
  onAutoSave,
}: ExamSessionManagerProps) {
  const [isRestored, setIsRestored] = useState(false)

  const {
    isLoading,
    currentSoalIndex,
    answers,
    setCurrentSoalIndex,
    setAnswer,
    lastSaved,
    needsSync,
  } = useExamSession({
    ujianId,
    autoSave: true,
    onRestore: (restoredState) => {
      setIsRestored(true)
      toast.success('Sesi ujian dipulihkan', {
        description: `Soal #${restoredState.currentSoalIndex + 1} dari ${Object.keys(restoredState.answers).length} jawaban tersimpan`,
        icon: <RotateCcw className="w-4 h-4" />,
      })
      onRestore?.({
        currentSoalIndex: restoredState.currentSoalIndex,
        answers: restoredState.answers,
      })
    },
    onAutoSave: (savedState) => {
      if (onAutoSave) {
        onAutoSave({
          currentSoalIndex: savedState.currentSoalIndex,
          answers: savedState.answers,
        })
      }
    },
  })

  const formatLastSaved = useCallback(() => {
    if (!lastSaved) return null
    
    const now = new Date()
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000)
    
    if (diff < 5) return 'Baru saja'
    if (diff < 60) return `${diff} detik yang lalu`
    if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`
    
    return lastSaved.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }, [lastSaved])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <RotateCcw className="absolute inset-0 m-auto w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Memulihkan sesi ujian
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Mengambil jawaban dan posisi soal terakhir...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {children({
        currentSoalIndex,
        answers,
        isLoading,
        isRestored,
        setCurrentSoalIndex,
        setAnswer,
      })}

      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {needsSync ? (
                <Save className="w-4 h-4 text-amber-500 animate-pulse" />
              ) : (
                <Clock className="w-4 h-4 text-green-500" />
              )}
              <div className="text-xs">
                <p className="text-gray-600 font-medium">
                  {needsSync ? 'Menyimpan...' : 'Tersimpan'}
                </p>
                {lastSaved && (
                  <p className="text-gray-400">
                    {formatLastSaved()}
                  </p>
                )}
              </div>
            </div>
            {isRestored && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                Dipulihkan
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

interface ExamSessionStatusProps {
  lastSaved: Date | null
  needsSync: boolean
  isRestored: boolean
}

export function ExamSessionStatus({ lastSaved, needsSync, isRestored }: ExamSessionStatusProps) {
  const formatLastSaved = useCallback(() => {
    if (!lastSaved) return null
    
    const now = new Date()
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000)
    
    if (diff < 5) return 'Baru saja'
    if (diff < 60) return `${diff} detik yang lalu`
    if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`
    
    return lastSaved.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }, [lastSaved])

  return (
    <div className="flex items-center gap-4 text-xs">
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
        needsSync 
          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
          : 'bg-green-50 text-green-700 border border-green-200'
      }`}>
        {needsSync ? (
          <Save className="w-3.5 h-3.5 animate-pulse" />
        ) : (
          <Clock className="w-3.5 h-3.5" />
        )}
        <span className="font-medium">
          {needsSync ? 'Menyimpan...' : 'Tersimpan'}
        </span>
      </div>
      
      {lastSaved && (
        <span className="text-gray-500">
          {formatLastSaved()}
        </span>
      )}
      
      {isRestored && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="font-medium">Sesi dipulihkan</span>
        </div>
      )}
    </div>
  )
}
