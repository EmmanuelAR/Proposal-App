export type Section = 'home' | 'moments' | 'settings'

const ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: 'home', label: 'Inicio', icon: '💞' },
  { id: 'moments', label: 'Momentos', icon: '📸' },
  { id: 'settings', label: 'Ajustes', icon: '⚙️' },
]

export function BottomNav({ current, onChange }: { current: Section; onChange: (s: Section) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-blush-200/70 bg-white/85 backdrop-blur dark:border-blush-800/70 dark:bg-blush-950/85">
      <div className="mx-auto flex max-w-md justify-around px-2 py-2">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 text-xs font-medium transition ${
              current === item.id
                ? 'bg-blush-100 text-blush-700 dark:bg-blush-900/60 dark:text-blush-200'
                : 'text-blush-400 dark:text-blush-500'
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
