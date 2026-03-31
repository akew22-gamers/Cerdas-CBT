'use client'

import { useEffect, useState } from 'react'

interface TimerProps {
  timeRemainingMs: number
  durasi: number
  onTimeUp: () => void
}

export function Timer({ timeRemainingMs, durasi, onTimeUp }: TimerProps) {
  const [seconds, setSeconds] = useState(Math.floor(timeRemainingMs / 1000))
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    setSeconds(Math.floor(timeRemainingMs / 1000))
    setHasTriggered(false)
  }, [timeRemainingMs])

  useEffect(() => {
    if (seconds <= 0 && !hasTriggered) {
      setHasTriggered(true)
      onTimeUp()
      return
    }

    if (seconds <= 0 || hasTriggered) return

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [seconds, onTimeUp, hasTriggered])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const displayTime = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`

  const durasiSeconds = durasi * 60
  const isWarning = seconds <= durasiSeconds * 0.1

  return (
    <div className={`
      text-2xl font-bold font-mono
      ${isWarning ? 'text-red-600 animate-pulse' : 'text-gray-900'}
    `}>
      {displayTime}
    </div>
  )
}
