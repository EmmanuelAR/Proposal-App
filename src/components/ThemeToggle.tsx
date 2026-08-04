import type { Theme } from '../state/types'

export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const isDark = theme === 'dark'
  return (
    <button
      onClick={onToggle}
      aria-label="Cambiar tema"
      className="fixed right-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-blush-300/60 bg-white/70 text-lg shadow-sm backdrop-blur transition hover:scale-105 dark:border-blush-800 dark:bg-blush-950/60"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  )
}
