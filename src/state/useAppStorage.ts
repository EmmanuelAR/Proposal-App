import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export function useAppStorage() {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [saidYes, setSaidYes] = useState(false)
  const [startDate, setStartDate] = useState<string | null>(null)

  const loadAppState = useCallback(async () => {
    setLoading(true)
    setLoadError(false)
    try {
      const { data, error } = await supabase.from('app_state').select('*').eq('id', 1).single()
      if (error || !data) {
        // Never silently fall back to "not proposed yet" on a failed fetch —
        // that would make an already-confirmed counter look reset.
        setLoadError(true)
        return
      }
      setSaidYes(data.said_yes)
      setStartDate(data.start_date)
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAppState()
  }, [loadAppState])

  // Split in two so the caller can play a celebration animation between the
  // moment we know the save succeeded and the moment the app switches
  // screens, without ever showing a "yes" that didn't actually persist.
  const persistYes = useCallback(async () => {
    const now = new Date().toISOString()
    const { error } = await supabase.from('app_state').update({ said_yes: true, start_date: now }).eq('id', 1)
    if (error) return null
    return now
  }, [])

  const applyYes = useCallback((now: string) => {
    setSaidYes(true)
    setStartDate(now)
  }, [])

  const resetAll = useCallback(async () => {
    const { error } = await supabase.from('app_state').update({ said_yes: false, start_date: null }).eq('id', 1)
    if (error) return false
    setSaidYes(false)
    setStartDate(null)
    return true
  }, [])

  return {
    loading,
    loadError,
    retryLoad: loadAppState,
    saidYes,
    startDate,
    persistYes,
    applyYes,
    resetAll,
  }
}
