'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export function useRealtimeSubscription<T extends Record<string, unknown>>(
  table: string,
  callback: (payload: RealtimePostgresChangesPayload<T>) => void,
  options?: {
    event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
    schema?: string
    filter?: {
      column: string
      value: string
    }
  }
): void {
  useEffect(() => {
    const supabase = createClient()
    const channelName = `${table}_changes_${Date.now()}`
    
    const channel = supabase.channel(channelName)

    const payloadFilter = {
      event: (options?.event as any) || '*',
      schema: options?.schema || 'public',
      table: table
    }

    channel.on('postgres_changes', payloadFilter, callback)
    
    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, callback, options?.event, options?.schema, options?.filter])
}
