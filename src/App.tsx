import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStorage } from './state/useAppStorage'
import { Lockscreen } from './screens/Lockscreen'
import { IntroScreen } from './screens/IntroScreen'
import { ProposalScreen } from './screens/ProposalScreen'
import { HomeCounter } from './screens/HomeCounter'
import { SettingsScreen } from './screens/SettingsScreen'
import { BottomNav, type Section } from './components/BottomNav'
import { LockButton } from './components/LockButton'
import { AmbientBlobs } from './components/AmbientBlobs'
import { pageVariants } from './lib/motion'

function App() {
  const store = useAppStorage()
  const [unlocked, setUnlocked] = useState(false)
  const [section, setSection] = useState<Section>('home')
  const [introSeen, setIntroSeen] = useState(false)

  if (!unlocked) {
    return <Lockscreen onUnlock={() => setUnlocked(true)} />
  }

  if (store.loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-6">
        <AmbientBlobs />
        <div className="animate-pulse-heart text-5xl">💗</div>
      </div>
    )
  }

  if (store.loadError) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <AmbientBlobs />
        <div className="text-4xl">📡💔</div>
        <p className="max-w-xs text-sm text-blush-600">No se pudo cargar el contador. Revisa tu conexión e intenta de nuevo.</p>
        <button onClick={store.retryLoad} className="glass-button rounded-2xl px-5 py-3 text-sm font-semibold">
          Reintentar
        </button>
      </div>
    )
  }

  if (!store.saidYes || !store.startDate) {
    if (!introSeen) {
      return <IntroScreen onContinue={() => setIntroSeen(true)} />
    }
    return <ProposalScreen onPersistYes={store.persistYes} onRevealed={store.applyYes} />
  }

  return (
    <div className="min-h-screen">
      <LockButton onLock={() => setUnlocked(false)} />

      <AnimatePresence mode="wait">
        {section === 'home' && (
          <motion.div key="home" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
            <HomeCounter startDate={store.startDate} />
          </motion.div>
        )}
        {section === 'settings' && (
          <motion.div key="settings" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
            <SettingsScreen
              onReset={async () => {
                const ok = await store.resetAll()
                if (ok) {
                  setIntroSeen(false)
                  setSection('home')
                }
                return ok
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav current={section} onChange={setSection} />
    </div>
  )
}

export default App
