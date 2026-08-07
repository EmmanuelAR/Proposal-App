import { useState } from 'react'
import { motion } from 'framer-motion'
import { AmbientBlobs } from '../components/AmbientBlobs'
import { pageVariants, staggerContainer, staggerItem } from '../lib/motion'

const PASSWORD = 'truelove'

export function Lockscreen({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [shake, setShake] = useState(false)
  const [tries, setTries] = useState(0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value.trim().toLowerCase() === PASSWORD) {
      onUnlock()
      return
    }
    setShake(true)
    setTries((t) => t + 1)
    setTimeout(() => setShake(false), 500)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <AmbientBlobs />
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm"
      >
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="text-center">
          <motion.div variants={staggerItem} className="mb-4 animate-pulse-heart text-5xl">
            💗
          </motion.div>
          <motion.p variants={staggerItem} className="mb-8 text-sm text-blush-600">
            Escribe la clave que solo tú y yo sabemos
          </motion.p>
          <motion.form
            variants={staggerItem}
            onSubmit={handleSubmit}
            animate={shake ? { x: [0, -10, 10, -8, 8, 0] } : {}}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-3"
          >
            <input
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Contraseña"
              autoFocus
              className="glass w-full rounded-2xl px-5 py-3 text-center text-lg text-blush-900 outline-none ring-blush-400 placeholder:text-blush-400/70 focus:ring-2"
            />
            <button type="submit" className="glass-button w-full rounded-2xl px-5 py-3 text-lg font-semibold transition hover:brightness-105 active:scale-95">
              Entrar 💌
            </button>
          </motion.form>
          {tries >= 3 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-xs text-blush-500">
              pista: es lo que sientes por mí, todo junto, en inglés 😉
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
