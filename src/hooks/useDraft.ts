import { useState, useEffect, useRef } from 'react'

export function useDraft<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial)
  const [restored, setRestored] = useState(false)
  const isFirstRender = useRef(true)

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        setState(JSON.parse(saved))
        setRestored(true)
      }
    } catch {}
    isFirstRender.current = false
  }, [key])

  // Persist to localStorage on every change (skip first render to avoid overwriting restored draft)
  useEffect(() => {
    if (isFirstRender.current) return
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {}
  }, [key, state])

  const clearDraft = () => {
    try { localStorage.removeItem(key) } catch {}
    setRestored(false)
  }

  return { state, setState, restored, clearDraft }
}
