import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 pb-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2 animate-float-slow text-6xl"
      >
        💗
      </motion.div>
      <h1 className="mb-1 font-script text-5xl text-blush-700 dark:text-blush-300">Nuestro true love</h1>
      <p className="mb-10 text-sm text-blush-500 dark:text-blush-300/80">Juntos desde el {startLabel}</p>

      <div className="grid w-full max-w-sm grid-cols-4 gap-3">
        {[
          { value: days, label: 'días' },
          { value: hours, label: 'horas' },
          { value: minutes, label: 'min' },
          { value: seconds, label: 'seg' },
        ].map((unit) => (
          <div
            key={unit.label}
            className="rounded-2xl border border-blush-200 bg-white/70 py-6 shadow-sm dark:border-blush-800 dark:bg-blush-950/50"
          >
            <div className="text-3xl font-bold text-blush-600 dark:text-blush-200 tabular-nums">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-wide text-blush-400 dark:text-blush-400/80">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
