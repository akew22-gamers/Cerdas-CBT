'use client'

import { useState, useCallback } from 'react'

interface PreExamModalProps {
  siswaInfo?: {
    nama: string
    nisn: string
  }
  onStartExam: () => void
}

export function PreExamModal({ siswaInfo, onStartExam }: PreExamModalProps) {
  const [fullscreenError, setFullscreenError] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)

  const handleStart = useCallback(async () => {
    setIsStarting(true)
    setFullscreenError(null)
    
    if (document.fullscreenEnabled) {
      try {
        await document.documentElement.requestFullscreen()
      } catch (err) {
        console.error('Fullscreen error:', err)
        setFullscreenError('Browser memblokir fullscreen. Ujian dapat dilanjutkan tanpa fullscreen.')
        setIsStarting(false)
        return
      }
    }
    
    onStartExam()
  }, [onStartExam])

  const handleContinueWithoutFullscreen = useCallback(() => {
    onStartExam()
  }, [onStartExam])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Siap Memulai Ujian?</h1>
        
        {siswaInfo && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Peserta:</p>
            <p className="font-semibold text-gray-900">{siswaInfo.nama}</p>
            <p className="text-sm text-gray-500">NISN: {siswaInfo.nisn || '-'}</p>
          </div>
        )}
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-medium text-amber-800 mb-2">Petunjuk Ujian:</h3>
          <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
            <li>Klik tombol "Mulai Ujian" di bawah</li>
            <li>Browser akan otomatis masuk mode fullscreen</li>
            <li>Jangan keluar dari mode fullscreen selama ujian</li>
            <li>Layar akan tetap aktif selama ujian berlangsung</li>
            <li>Klik "Kirim Jawaban" jika sudah selesai</li>
          </ul>
        </div>
        
        {fullscreenError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-red-800 font-medium mb-2">⚠️ Perhatian:</p>
            <p className="text-sm text-red-700">{fullscreenError}</p>
          </div>
        )}
        
        <div className="space-y-3">
          <button
            onClick={fullscreenError ? handleContinueWithoutFullscreen : handleStart}
            disabled={isStarting && !fullscreenError}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStarting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Memulai...
              </span>
            ) : fullscreenError ? (
              'Lanjutkan Tanpa Fullscreen'
            ) : (
              'Mulai Ujian'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}