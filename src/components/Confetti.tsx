import { motion } from 'framer-motion'
import { useMemo } from 'react'

const EMOJIS = ['💗', '💖', '💕', '🌹', '✨', '💘']

export function Confetti({ count = 40 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.6,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        rotate: Math.random() * 360,
        size: 16 + Math.random() * 18,
      })),
    [count],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: -40, x: `${p.left}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', rotate: p.rotate, opacity: [1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{ position: 'absolute', fontSize: p.size, left: 0, top: 0 }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  )
}
