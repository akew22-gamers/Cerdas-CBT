'use client'

import { useEffect, useState, useCallback } from 'react'
import { FullscreenWarning } from './FullscreenWarning'

interface AntiCheatingProps {
  ujianId: string
  onFullscreenExit?: () => void
}

export function AntiCheating({ ujianId, onFullscreenExit }: AntiCheatingProps) {
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false)

  const logCheatingEvent = useCallback(async (eventType: string, details?: Record<string, any>) => {
    try {
      await fetch(`/api/siswa/ujian/${ujianId}/cheating-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: eventType, details })
      })
    } catch (error) {
      console.error('Failed to log cheating event:', error)
    }
  }, [ujianId])

  const enterFullscreen = useCallback(async () => {
    try {
      const elem = document.documentElement
      if (elem.requestFullscreen) {
        await elem.requestFullscreen()
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen()
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen()
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error)
    }
  }, [])

  const handleFullscreenChange = useCallback(() => {
    const fullscreenElement = document.fullscreenElement
    
    if (!fullscreenElement) {
      setShowFullscreenWarning(true)
      logCheatingEvent('fullscreen_exit', {
        timestamp: new Date().toISOString()
      })
      onFullscreenExit?.()
    } else {
      setShowFullscreenWarning(false)
    }
  }, [logCheatingEvent, onFullscreenExit])

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      logCheatingEvent('tab_switch', {
        timestamp: new Date().toISOString()
      })
    }
  }, [logCheatingEvent])

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [handleFullscreenChange, handleVisibilityChange])

  const handleReenterFullscreen = async () => {
    setShowFullscreenWarning(false)
    await enterFullscreen()
  }

  return (
    <>
      <FullscreenWarning
        open={showFullscreenWarning}
        onReenterFullscreen={handleReenterFullscreen}
      />
    </>
  )
}
