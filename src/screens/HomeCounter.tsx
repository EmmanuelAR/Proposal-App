import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PhotoMosaicBackground } from '../components/PhotoMosaicBackground'
import { pageVariants, staggerContainer, staggerItem } from '../lib/motion'

function diffParts(startMs: number, nowMs: number) {
  let total = Math.max(0, Math.floor((nowMs - startMs) / 1000))
  const days = Math.floor(total / 86400)
  total -= days * 86400
  const hours = Math.floor(total / 3600)
  total -= hours * 3600
  const minutes = Math.floor(total / 60)
  const seconds = total - minutes * 60
  return { days, hours, minutes, seconds }
}

export function HomeCounter({ startDate }: { startDate: string }) {
  const startMs = useMemo(() => new Date(startDate).getTime(), [startDate])
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const { days, hours, minutes, seconds } = diffParts(startMs, now)

  const startLabel = useMemo(
    () =>
      new Date(startDate).toLocaleDateString('es', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [startDate],
  )

  const units = [
    { value: days, label: 'días' },
    { value: hours, label: 'horas' },
    { value: minutes, label: 'min' },
    { value: seconds, label: 'seg' },
  ]

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-16 text-center">
      <PhotoMosaicBackground />
      <motion.div variants={pageVariants} initial="hidden" animate="visible" className="flex flex-col items-center">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col items-center">
          <motion.div variants={staggerItem} className="mb-2 animate-float-slow text-6xl">
            💗
          </motion.div>
          <motion.h1 variants={staggerItem} className="mb-1 font-script text-5xl font-semibold text-blush-700">
            Nuestro true love
          </motion.h1>
          <motion.p variants={staggerItem} className="mb-10 text-sm text-blush-600">
            Juntos desde el {startLabel}
          </motion.p>

          <motion.div variants={staggerItem} className="grid w-full max-w-sm grid-cols-4 gap-3">
            {units.map((unit) => (
              <div key={unit.label} className="glass rounded-2xl py-6">
                <div className="gold-text text-3xl font-bold tabular-nums">{String(unit.value).padStart(2, '0')}</div>
                <div className="mt-1 text-[10px] uppercase tracking-wide text-blush-500/80">{unit.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
