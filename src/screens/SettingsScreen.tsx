import { useState } from 'react'
import type { Moment } from '../state/types'

const CONFIRM_WORD = 'REINICIAR'

export function SettingsScreen({
  moments,
  onReset,
}: {
  moments: Moment[]
  onReset: () => Promise<void>
}) {
  const [step, setStep] = useState<'idle' | 'warn' | 'confirm' | 'loading'>('idle')
  const [typedWord, setTypedWord] = useState('')

  function openWarn() {
    setTypedWord('')
    setStep('warn')
  }

  async function handleFinalConfirm() {
    setStep('loading')
    await onReset()
  }

  function closeAll() {
    setStep('idle')
    setTypedWord('')
  }

  return (
    <div className="min-h-screen px-5 pb-28 pt-24">
      <h1 className="mb-5 font-script text-3xl text-blush-700 dark:text-blush-300">Ajustes</h1>

      <div className="rounded-2xl border border-red-200 bg-red-50/60 p-4 dark:border-red-900/60 dark:bg-red-950/20">
        <h2 className="mb-1 text-sm font-semibold text-red-600 dark:text-red-400">Zona de peligro</h2>
        <p className="mb-4 text-xs text-red-500/90 dark:text-red-300/80">
          Esto reinicia la app por completo: se borra el contador (volverá a aparecer la pregunta de "¿quieres ser mi
          novia?") y se eliminan todos los momentos guardados. No se puede deshacer.
        </p>
        <button
          onClick={openWarn}
          className="w-full rounded-xl border border-red-300 bg-white py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-800 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-950/30"
        >
          Reiniciar todo
        </button>
      </div>

      {step === 'warn' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6" onClick={closeAll}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-blush-950"
          >
            <div className="mb-2 text-3xl">⚠️</div>
            <p className="mb-4 text-sm text-blush-700 dark:text-blush-200">
              Se borrará el contador y los <span className="font-semibold">{moments.length}</span> momentos guardados
              para siempre.
              <br />
              Para continuar escribe <span className="font-mono font-semibold">{CONFIRM_WORD}</span>:
            </p>
            <input
              value={typedWord}
              onChange={(e) => setTypedWord(e.target.value)}
              autoFocus
              className="mb-4 w-full rounded-xl border border-blush-200 px-4 py-2 text-center uppercase outline-none focus:ring-2 focus:ring-red-400 dark:border-blush-800 dark:bg-blush-900/50 dark:text-blush-100"
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
                className="flex-1 rounded-xl border border-blush-200 py-2 text-sm font-medium text-blush-500 dark:border-blush-800"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6" onClick={closeAll}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-blush-950"
          >
            <div className="mb-2 text-3xl">🥺</div>
            <p className="mb-5 text-sm font-semibold text-blush-700 dark:text-blush-200">
              Última confirmación: ¿reiniciar todo definitivamente?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleFinalConfirm}
                className="flex-1 rounded-xl bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Sí, borrar todo
              </button>
              <button
                onClick={closeAll}
                className="flex-1 rounded-xl border border-blush-200 py-2 text-sm font-medium text-blush-500 dark:border-blush-800"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'loading' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="animate-pulse-heart text-5xl">💗</div>
        </div>
      )}
    </div>
  )
}
