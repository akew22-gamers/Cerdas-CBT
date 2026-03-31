'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

const STORAGE_PREFIX = 'exam_'

const AUTO_SAVE_INTERVAL_MS = 30 * 1000

interface ExamState {
  ujianId: string
  currentSoalIndex: number
  answers: Record<string, string>
  startTime: number
  lastSaved: number
}

interface UseExamSessionOptions {
  ujianId: string
  autoSave?: boolean
  onRestore?: (state: ExamState) => void
  onAutoSave?: (state: ExamState) => void
}

interface UseExamSessionReturn {
  state: ExamState | null
  isLoading: boolean
  currentSoalIndex: number
  answers: Record<string, string>
  setCurrentSoalIndex: (index: number) => void
  setAnswer: (soalId: string, answer: string) => void
  restore: () => Promise<boolean>
  clear: () => void
  lastSaved: Date | null
  needsSync: boolean
}

function getStorageKey(ujianId: string): string {
  return `${STORAGE_PREFIX}${ujianId}`
}

function loadFromStorage(ujianId: string): ExamState | null {
  try {
    const key = getStorageKey(ujianId)
    const data = localStorage.getItem(key)
    if (!data) return null
    
    const state: ExamState = JSON.parse(data)
    
    if (state.ujianId !== ujianId) {
      return null
    }
    
    return state
  } catch (error) {
    console.error('Failed to load exam state from storage:', error)
    return null
  }
}

function saveToStorage(state: ExamState): void {
  try {
    const key = getStorageKey(state.ujianId)
    localStorage.setItem(key, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save exam state to storage:', error)
  }
}

function removeFromStorage(ujianId: string): void {
  try {
    const key = getStorageKey(ujianId)
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to remove exam state from storage:', error)
  }
}

export function useExamSession({
  ujianId,
  autoSave = true,
  onRestore,
  onAutoSave,
}: UseExamSessionOptions): UseExamSessionReturn {
  const [state, setState] = useState<ExamState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [needsSync, setNeedsSync] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isRestoredRef = useRef(false)

  const initializeState = useCallback(() => {
    const initialState: ExamState = {
      ujianId,
      currentSoalIndex: 0,
      answers: {},
      startTime: Date.now(),
      lastSaved: Date.now(),
    }
    setState(initialState)
    return initialState
  }, [ujianId])

  const saveToStorageWithTimestamp = useCallback((currentState: ExamState) => {
    const updatedState = {
      ...currentState,
      lastSaved: Date.now(),
    }
    saveToStorage(updatedState)
    return updatedState
  }, [])

  const restore = useCallback(async (): Promise<boolean> => {
    try {
      const savedState = loadFromStorage(ujianId)
      
      if (savedState) {
        setState(savedState)
        isRestoredRef.current = true
        
        if (onRestore) {
          onRestore(savedState)
        }
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Failed to restore exam state:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [ujianId, onRestore])

  const clear = useCallback(() => {
    removeFromStorage(ujianId)
    setState(null)
    isRestoredRef.current = false
    setNeedsSync(false)
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [ujianId])

  const setCurrentSoalIndex = useCallback((index: number) => {
    setState(prev => {
      if (!prev) return null
      
      const updated = {
        ...prev,
        currentSoalIndex: index,
      }
      
      if (autoSave) {
        saveToStorageWithTimestamp(updated)
      }
      
      return updated
    })
  }, [autoSave, saveToStorageWithTimestamp])

  const setAnswer = useCallback((soalId: string, answer: string) => {
    setState(prev => {
      if (!prev) return null
      
      const updated = {
        ...prev,
        answers: {
          ...prev.answers,
          [soalId]: answer,
        },
      }
      
      setNeedsSync(true)
      
      if (autoSave) {
        saveToStorageWithTimestamp(updated)
        
        if (onAutoSave) {
          onAutoSave(updated)
        }
      }
      
      return updated
    })
  }, [autoSave, saveToStorageWithTimestamp, onAutoSave])

  useEffect(() => {
    setIsLoading(true)
    restore().then(() => {
      if (!isRestoredRef.current) {
        initializeState()
        setIsLoading(false)
      }
    })
  }, [ujianId, restore, initializeState])

  useEffect(() => {
    if (!autoSave || !state || isLoading) return

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      if (state) {
        const savedState = saveToStorageWithTimestamp(state)
        
        if (onAutoSave) {
          onAutoSave(savedState)
        }
      }
    }, AUTO_SAVE_INTERVAL_MS)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoSave, state, isLoading, saveToStorageWithTimestamp, onAutoSave])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (state) {
        saveToStorageWithTimestamp(state)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [state, saveToStorageWithTimestamp])

  const lastSaved = state?.lastSaved ? new Date(state.lastSaved) : null

  return {
    state,
    isLoading,
    currentSoalIndex: state?.currentSoalIndex ?? 0,
    answers: state?.answers ?? {},
    setCurrentSoalIndex,
    setAnswer,
    restore,
    clear,
    lastSaved,
    needsSync,
  }
}
