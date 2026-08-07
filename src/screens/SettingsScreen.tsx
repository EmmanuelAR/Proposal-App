import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AmbientBlobs } from '../components/AmbientBlobs'
import { pageVariants, staggerContainer, staggerItem } from '../lib/motion'

const CONFIRM_WORD = 'REINICIAR'

export function SettingsScreen({ onReset }: { onReset: () => Promise<boolean> }) {
  const [step, setStep] = useState<'idle' | 'warn' | 'confirm' | 'loading'>('idle')
  const [typedWord, setTypedWord] = useState('')
  const [resetError, setResetError] = useState(false)

  function openWarn() {
    setTypedWord('')
    setResetError(false)
    setStep('warn')
  }

  async function handleFinalConfirm() {
    setStep('loading')
    const ok = await onReset()
    if (!ok) {
      setResetError(true)
      setStep('confirm')
    }
  }

  function closeAll() {
    setStep('idle')
    setTypedWord('')
  }

  return (
    <div className="relative min-h-screen px-5 pb-28 pt-24">
      <AmbientBlobs />
      <motion.div variants={pageVariants} initial="hidden" animate="visible">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.h1 variants={staggerItem} className="mb-5 font-script text-3xl font-semibold text-blush-700">
            Ajustes
          </motion.h1>

          <motion.div variants={staggerItem} className="glass rounded-2xl border-red-200/60 p-4">
            <h2 className="mb-1 text-sm font-semibold text-red-600">Zona de peligro</h2>
            <p className="mb-4 text-xs text-red-500/90">
              Esto reinicia la app por completo: se borra el contador y volverá a aparecer la pregunta de "¿quieres
              ser mi novia?". No se puede deshacer.
            </p>
            <button
              onClick={openWarn}
              className="w-full rounded-xl border border-red-300/70 bg-white/50 py-2 text-sm font-semibold text-red-600 backdrop-blur transition hover:bg-white/70"
            >
              Reiniciar todo
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {step === 'warn' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6 backdrop-blur-sm"
            onClick={closeAll}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-xs rounded-2xl p-6 text-center"
            >
              <div className="mb-2 text-3xl">⚠️</div>
              <p className="mb-4 text-sm text-blush-700">
                Se borrará el contador para siempre.
                <br />
                Para continuar escribe <span className="font-mono font-semibold">{CONFIRM_WORD}</span>:
              </p>
              <input
                value={typedWord}
                onChange={(e) => setTypedWord(e.target.value)}
                autoFocus
                className="glass mb-4 w-full rounded-xl px-4 py-2 text-center uppercase outline-none focus:ring-2 focus:ring-red-400"
              />
              <div className="flex gap-2">
                <button
                  disabled={typedWord.trim().toUpperCase() !== CONFIRM_WORD}
                  onClick={() => setStep('confirm')}
                  className="flex-1 rounded-xl bg-red-500 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continuar
                </button>
                <button
                  onClick={closeAll}
                  className="glass flex-1 rounded-xl py-2 text-sm font-medium text-blush-600"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6 backdrop-blur-sm"
            onClick={closeAll}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-xs rounded-2xl p-6 text-center"
            >
              <div className="mb-2 text-3xl">🥺</div>
              <p className="mb-5 text-sm font-semibold text-blush-700">
                Última confirmación: ¿reiniciar todo definitivamente?
              </p>
              {resetError && (
                <p className="mb-3 text-xs text-red-500">
                  No se pudo guardar por un problema de conexión. Intenta de nuevo.
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleFinalConfirm}
                  className="flex-1 rounded-xl bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600"
                >
                  Sí, borrar todo
                </button>
                <button onClick={closeAll} className="glass flex-1 rounded-xl py-2 text-sm font-medium text-blush-600">
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6 backdrop-blur-sm"
          >
            <div className="animate-pulse-heart text-5xl">💗</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
