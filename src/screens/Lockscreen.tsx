import { useState } from 'react'
import { motion } from 'framer-motion'

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blush-100 via-blush-50 to-white px-6 dark:from-blush-950 dark:via-[#1a0a10] dark:to-[#120609]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center"
      >
        <div className="mb-4 animate-pulse-heart text-5xl">💗</div>
        <h1 className="mb-2 font-script text-4xl text-blush-700 dark:text-blush-300">Nuestro espacio</h1>
        <p className="mb-8 text-sm text-blush-600 dark:text-blush-200/80">
          Escribe la clave que solo tú y yo sabemos
        </p>
        <motion.form
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
            className="w-full rounded-2xl border border-blush-200 bg-white/80 px-5 py-3 text-center text-lg text-blush-900 shadow-sm outline-none ring-blush-400 placeholder:text-blush-300 focus:ring-2 dark:border-blush-800 dark:bg-blush-950/60 dark:text-blush-100"
          />
          <button
            type="submit"
            className="w-full rounded-2xl bg-blush-500 px-5 py-3 text-lg font-semibold text-white shadow-lg shadow-blush-500/30 transition hover:bg-blush-600 active:scale-95"
          >
            Entrar 💌
          </button>
        </motion.form>
        {tries >= 3 && (
          <p className="mt-4 text-xs text-blush-500 dark:text-blush-300">
            pista: es lo que sientes por mí, todo junto, en inglés 😉
          </p>
        )}
      </motion.div>
    </div>
  )
}
