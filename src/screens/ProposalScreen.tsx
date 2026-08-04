import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Confetti } from '../components/Confetti'

const NO_EXCUSES = [
  'No',
  '¿Segura?',
  'Piénsalo bien...',
  'Última oportunidad',
  'En serio?? 🥺',
  '¡No puedes escapar del amor!',
  'Intenta otra vez 😏',
]

export function ProposalScreen({ onYes }: { onYes: () => void }) {
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null)
  const [noIndex, setNoIndex] = useState(0)
  const [yesScale, setYesScale] = useState(1)
  const [celebrating, setCelebrating] = useState(false)
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

  function handleYes() {
    setCelebrating(true)
    setTimeout(onYes, 1600)
  }

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blush-100 via-blush-50 to-white px-6 text-center dark:from-blush-950 dark:via-[#1a0a10] dark:to-[#120609]"
    >
      {celebrating && <Confetti />}

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2 text-6xl"
      >
        {celebrating ? '🥳' : '💌'}
      </motion.div>

      <h1 className="mb-10 max-w-xs font-script text-5xl leading-tight text-blush-700 dark:text-blush-300">
        {celebrating ? '¡Sabía que dirías que sí!' : '¿Quieres ser mi novia?'}
      </h1>

      {!celebrating && (
        <div className="relative flex h-40 w-full max-w-sm items-center justify-center gap-4">
          <motion.button
            animate={{ scale: yesScale }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            onClick={handleYes}
            className="z-10 rounded-full bg-blush-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-blush-500/40 active:scale-95"
          >
            Sí, quiero 💗
          </motion.button>

          <motion.button
            animate={noPos ? { x: noPos.x - (containerRef.current?.clientWidth ?? 0) / 2 + 100, y: noPos.y - 20 } : {}}
            onMouseEnter={evadeNo}
            onClick={evadeNo}
            onTouchStart={evadeNo}
            transition={{ type: 'spring', stiffness: 250, damping: 18 }}
            style={{ position: noPos ? 'absolute' : 'relative' }}
            className="whitespace-nowrap rounded-full border-2 border-blush-300 bg-white/70 px-6 py-4 text-base font-semibold text-blush-500 shadow-sm dark:border-blush-700 dark:bg-blush-950/50 dark:text-blush-300"
          >
            {NO_EXCUSES[noIndex]}
          </motion.button>
        </div>
      )}
    </div>
  )
}
