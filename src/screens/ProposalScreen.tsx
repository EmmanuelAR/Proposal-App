import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Confetti } from '../components/Confetti'
import { AmbientBlobs } from '../components/AmbientBlobs'
import { pageVariants } from '../lib/motion'

const NO_EXCUSES = [
  'No',
  '¿Segura?',
  'Piénsalo bien...',
  'Última oportunidad',
  'En serio?? 🥺',
  '¡No puedes escapar del amor!',
  'Intenta otra vez 😏',
]

export function ProposalScreen({
  onPersistYes,
  onRevealed,
}: {
  onPersistYes: () => Promise<string | null>
  onRevealed: (startDate: string) => void
}) {
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null)
  const [noIndex, setNoIndex] = useState(0)
  const [yesScale, setYesScale] = useState(1)
  const [celebrating, setCelebrating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  function evadeNo() {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const btnW = 140
    const btnH = 56
    const maxX = Math.max(rect.width - btnW, 0)
    const maxY = Math.max(rect.height - btnH, 0)
    const x = Math.random() * maxX
    const y = Math.random() * maxY
    setNoPos({ x, y })
    setNoIndex((i) => Math.min(i + 1, NO_EXCUSES.length - 1))
    setYesScale((s) => Math.min(s + 0.12, 2.2))
  }

  async function handleYes() {
    if (saving) return
    setSaving(true)
    setSaveError(false)
    const savedStartDate = await onPersistYes()
    if (!savedStartDate) {
      setSaving(false)
      setSaveError(true)
      return
    }
    // Only celebrate once we know it's actually saved; reveal the rest of
    // the app after the animation has had a moment to play.
    setCelebrating(true)
    setTimeout(() => onRevealed(savedStartDate), 1600)
  }

  return (
    <div ref={containerRef} className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <AmbientBlobs />
      {celebrating && <Confetti />}

      <motion.div variants={pageVariants} initial="hidden" animate="visible" className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-6xl"
        >
          {celebrating ? '🥳' : '💌'}
        </motion.div>

        <h1 className="mb-10 max-w-xs font-script text-5xl font-semibold leading-tight text-blush-700">
          {celebrating ? 'iiiiii' : '¿Quieres ser mi novia?'}
        </h1>

        {!celebrating && (
          <div className="relative flex h-40 w-full max-w-sm items-center justify-center gap-4">
            <motion.button
              animate={{ scale: yesScale }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              onClick={handleYes}
              disabled={saving}
              className="glass-button z-10 rounded-full px-8 py-4 text-lg font-bold disabled:opacity-70"
            >
              {saving ? 'Un momento...' : 'Sí, quiero 💗'}
            </motion.button>

            <motion.button
              animate={noPos ? { x: noPos.x - (containerRef.current?.clientWidth ?? 0) / 2 + 100, y: noPos.y - 20 } : {}}
              onMouseEnter={evadeNo}
              onClick={evadeNo}
              onTouchStart={evadeNo}
              transition={{ type: 'spring', stiffness: 250, damping: 18 }}
              style={{ position: noPos ? 'absolute' : 'relative' }}
              className="glass whitespace-nowrap rounded-full px-6 py-4 text-base font-semibold text-blush-600"
            >
              {NO_EXCUSES[noIndex]}
            </motion.button>
          </div>
        )}

        {saveError && (
          <p className="mt-6 max-w-xs text-sm text-red-500">
            No se pudo guardar por un problema de conexión. Intenta de nuevo 🙏
          </p>
        )}
      </motion.div>
    </div>
  )
}
