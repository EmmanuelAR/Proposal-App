import { useCallback, useEffect, useState } from 'react'
import type { Moment, Theme } from './types'
import { supabase, PHOTOS_BUCKET } from './supabaseClient'

const THEME_KEY = 'proposal.theme'

function readTheme(): Theme {
  return (localStorage.getItem(THEME_KEY) as Theme) || 'light'
}

export function useAppStorage() {
  const [loading, setLoading] = useState(true)
  const [saidYes, setSaidYes] = useState(false)
  const [startDate, setStartDate] = useState<string | null>(null)
  const [theme, setThemeState] = useState<Theme>(readTheme)
  const [moments, setMoments] = useState<Moment[]>([])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    async function loadAll() {
      const [stateRes, momentsRes] = await Promise.all([
        supabase.from('app_state').select('*').eq('id', 1).single(),
        supabase.from('moments').select('*').order('date', { ascending: true }),
      ])

      if (stateRes.data) {
        setSaidYes(stateRes.data.said_yes)
        setStartDate(stateRes.data.start_date)
      }
      if (momentsRes.data) {
        setMoments(
          momentsRes.data.map((m) => ({
            id: m.id,
            title: m.title,
            date: m.date ?? '',
            description: m.description ?? '',
            photos: m.photos ?? [],
            seeded: m.seeded,
          })),
        )
      }
      setLoading(false)
    }
    loadAll()
  }, [])

  const confirmYes = useCallback(async () => {
    const now = new Date().toISOString()
    setSaidYes(true)
    setStartDate(now)
    await supabase.from('app_state').update({ said_yes: true, start_date: now }).eq('id', 1)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === 'light' ? 'dark' : 'light'))
  }, [])

  const addMoment = useCallback(async (moment: Omit<Moment, 'id'>) => {
    const { data } = await supabase
      .from('moments')
      .insert({
        title: moment.title,
        date: moment.date || null,
        description: moment.description,
        photos: moment.photos,
        seeded: false,
      })
      .select()
      .single()
    if (data) {
      setMoments((prev) => [
        ...prev,
        { id: data.id, title: data.title, date: data.date ?? '', description: data.description ?? '', photos: data.photos ?? [] },
      ])
    }
  }, [])

  const removeMoment = useCallback(async (id: string) => {
    setMoments((prev) => prev.filter((m) => m.id !== id))
    await supabase.from('moments').delete().eq('id', id)
  }, [])

  const updateMoment = useCallback(
    async (id: string, updates: Partial<Pick<Moment, 'title' | 'date' | 'description' | 'photos'>>) => {
      setMoments((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)))
      await supabase
        .from('moments')
        .update({
          ...(updates.title !== undefined && { title: updates.title }),
          ...(updates.date !== undefined && { date: updates.date || null }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.photos !== undefined && { photos: updates.photos }),
        })
        .eq('id', id)
    },
    [],
  )

  const resetAll = useCallback(async () => {
    await Promise.all([
      supabase.from('app_state').update({ said_yes: false, start_date: null }).eq('id', 1),
      supabase.from('moments').delete().not('id', 'is', null),
    ])
    setSaidYes(false)
    setStartDate(null)
    setMoments([])
  }, [])

  const uploadPhoto = useCallback(async (file: File) => {
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `uploads/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from(PHOTOS_BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })
    if (error) throw error
    const { data } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }, [])

  return {
    loading,
    saidYes,
    startDate,
    confirmYes,
    theme,
    toggleTheme,
    moments,
    addMoment,
    removeMoment,
    updateMoment,
    uploadPhoto,
    resetAll,
  }
}
