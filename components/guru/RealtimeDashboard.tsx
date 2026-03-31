'use client'

import { useEffect } from 'react'
import { useHasilUjianRealtime, type HasilUjianData } from '@/lib/hooks/useHasilUjianRealtime'
import { toast } from 'sonner'

interface RealtimeDashboardProps {
  ujianIds: string[]
  children: React.ReactNode
  onStatsUpdate?: () => void
}

export function RealtimeDashboard({ ujianIds, children, onStatsUpdate }: RealtimeDashboardProps) {
  const handleNewResult = (hasil: HasilUjianData) => {
    if (hasil.nilai !== undefined && hasil.is_submitted) {
      toast.success('Hasil ujian baru masuk!', {
        description: `Nilai: ${hasil.nilai}`,
        duration: 4000
      })
    } else {
      toast.info('Siswa sedang mengerjakan ujian', {
        duration: 3000
      })
    }
    
    if (onStatsUpdate) {
      onStatsUpdate()
    }
  }

  const { subscribe, isSubscribed } = useHasilUjianRealtime({
    ujianIds,
    onNewResultAction: handleNewResult
  })

  useEffect(() => {
    if (ujianIds.length > 0 && !isSubscribed) {
      subscribe()
    }
  }, [ujianIds, isSubscribed, subscribe])

  return (
    <>
      <div className="relative">
        {children}
        {isSubscribed && (
          <div className="absolute top-0 right-0 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>
        )}
      </div>
    </>
  )
}
