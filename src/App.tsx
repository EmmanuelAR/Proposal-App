import { useState } from 'react'
import { useAppStorage } from './state/useAppStorage'
import { Lockscreen } from './screens/Lockscreen'
import { IntroScreen } from './screens/IntroScreen'
import { ProposalScreen } from './screens/ProposalScreen'
import { HomeCounter } from './screens/HomeCounter'
import { MomentsScreen } from './screens/MomentsScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { BottomNav, type Section } from './components/BottomNav'
import { ThemeToggle } from './components/ThemeToggle'
import { LockButton } from './components/LockButton'

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
      <div className="flex min-h-screen items-center justify-center bg-blush-50 dark:bg-[#1a0a10]">
        <div className="animate-pulse-heart text-5xl">💗</div>
      </div>
    )
  }

  if (!store.saidYes || !store.startDate) {
    if (!introSeen) {
      return <IntroScreen onContinue={() => setIntroSeen(true)} />
    }
    return <ProposalScreen onYes={store.confirmYes} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blush-50 via-white to-blush-50 dark:from-[#1a0a10] dark:via-[#120609] dark:to-[#1a0a10]">
      <ThemeToggle theme={store.theme} onToggle={store.toggleTheme} />
      <LockButton onLock={() => setUnlocked(false)} />

      {section === 'home' && <HomeCounter startDate={store.startDate} />}
      {section === 'moments' && (
        <MomentsScreen
          moments={store.moments}
          onAddMoment={store.addMoment}
          onUpdateMoment={store.updateMoment}
          onRemoveMoment={store.removeMoment}
          uploadPhoto={store.uploadPhoto}
        />
      )}
      {section === 'settings' && (
        <SettingsScreen
          moments={store.moments}
          onReset={async () => {
            await store.resetAll()
            setIntroSeen(false)
            setSection('home')
          }}
        />
      )}

      <BottomNav current={section} onChange={setSection} />
    </div>
  )
}

export default App
