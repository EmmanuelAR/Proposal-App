export type Section = 'home' | 'settings'

const ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: 'home', label: 'Inicio', icon: '💞' },
  { id: 'settings', label: 'Ajustes', icon: '⚙️' },
]

export function BottomNav({ current, onChange }: { current: Section; onChange: (s: Section) => void }) {
  return (
    <nav className="glass-strong fixed inset-x-4 bottom-4 z-40 rounded-3xl">
      <div className="mx-auto flex max-w-md justify-around px-2 py-2">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex flex-col items-center gap-0.5 rounded-2xl px-6 py-1.5 text-xs font-medium transition ${
              current === item.id ? 'bg-white/60 text-blush-700' : 'text-blush-500/80'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
