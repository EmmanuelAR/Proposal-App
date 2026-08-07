export function LockButton({ onLock }: { onLock: () => void }) {
  return (
    <button
      onClick={onLock}
      aria-label="Salir"
      className="glass fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-full text-lg transition hover:scale-105"
    >
      🔒
    </button>
  )
}
