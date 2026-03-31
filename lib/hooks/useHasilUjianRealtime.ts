'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export interface HasilUjianData {
  id: string
  siswa_id: string
  ujian_id: string
  nilai?: number
  is_submitted: boolean
  waktu_selesai?: string
  created_at: string
}

export function useHasilUjianRealtime({
  ujianIds,
  onNewResultAction
}: {
  ujianIds: string[]
  onNewResultAction?: (hasil: HasilUjianData) => void
}): {
  newResults: HasilUjianData[]
  subscribe: () => void
  unsubscribe: () => void
  isSubscribed: boolean
} {
  const [newResults, setNewResults] = useState<HasilUjianData[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNewResult = useCallback((payload: RealtimePostgresChangesPayload<HasilUjianData>) => {
    if (!payload.new || typeof payload.new !== 'object' || !('ujian_id' in payload.new)) return
    const newHasil = payload.new as HasilUjianData
    
    if (ujianIds.includes(newHasil.ujian_id)) {
      setNewResults((prev) => [...prev, newHasil])
      onNewResultAction?.(newHasil)
    }
  }, [ujianIds, onNewResultAction])

  const subscribe = useCallback(() => {
    if (isSubscribed || ujianIds.length === 0) return

    const supabase = createClient()
    const channelName = `hasil_ujian_${ujianIds.join('_')}_${Date.now()}`
    const channel = supabase.channel(channelName)

    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'hasil_ujian'
      },
      handleNewResult
    )

    channel.subscribe()
    setIsSubscribed(true)

    ;(window as any)._hasilUjianChannel = channel
  }, [isSubscribed, ujianIds, handleNewResult])

  const unsubscribe = useCallback(() => {
    const channel = (window as any)._hasilUjianChannel
    if (channel) {
      const supabase = createClient()
      supabase.removeChannel(channel)
      ;(window as any)._hasilUjianChannel = null
      setIsSubscribed(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      unsubscribe()
    }
  }, [unsubscribe])

  return {
    newResults,
    subscribe,
    unsubscribe,
    isSubscribed
  }
}
