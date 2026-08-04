import { useState } from 'react'
import type { Moment } from '../state/types'

type MomentValues = { title: string; date: string; description: string; photos: string[] }

function MomentEditor({
  initial,
  photos,
  uploading,
  onUpload,
  onRemovePhoto,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial: { title: string; date: string; description: string }
  photos: string[]
  uploading: boolean
  onUpload: (files: FileList | null) => void
  onRemovePhoto: (url: string) => void
  onSubmit: (values: MomentValues) => void
  onCancel: () => void
  submitLabel: string
}) {
  const [title, setTitle] = useState(initial.title)
  const [date, setDate] = useState(initial.date)
  const [description, setDescription] = useState(initial.description)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!title.trim()) return
        onSubmit({ title, date, description, photos })
      }}
      className="mb-6 space-y-3 rounded-2xl border border-blush-200 bg-white/70 p-4 dark:border-blush-800 dark:bg-blush-950/50"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título del momento"
        className="w-full rounded-xl border border-blush-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blush-400 dark:border-blush-800 dark:bg-blush-900/50 dark:text-blush-100"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full rounded-xl border border-blush-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blush-400 dark:border-blush-800 dark:bg-blush-900/50 dark:text-blush-100"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Cuéntalo con tus palabras..."
        rows={3}
        className="w-full rounded-xl border border-blush-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blush-400 dark:border-blush-800 dark:bg-blush-900/50 dark:text-blush-100"
      />
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => onUpload(e.target.files)}
        className="w-full text-xs text-blush-500"
      />
      {uploading && <p className="text-xs text-blush-400">Subiendo fotos...</p>}
      {photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {photos.map((p) => (
            <div key={p} className="relative shrink-0">
              <img src={p} className="h-16 w-16 rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => onRemovePhoto(p)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blush-600 text-[10px] text-white shadow"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={uploading}
          className="flex-1 rounded-xl bg-blush-500 py-2 text-sm font-semibold text-white hover:bg-blush-600 disabled:opacity-60"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-blush-200 px-4 py-2 text-sm font-medium text-blush-500 dark:border-blush-800"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export function MomentsScreen({
  moments,
  onAddMoment,
  onUpdateMoment,
  onRemoveMoment,
  uploadPhoto,
}: {
  moments: Moment[]
  onAddMoment: (m: Omit<Moment, 'id'>) => void
  onUpdateMoment: (id: string, updates: MomentValues) => void
  onRemoveMoment: (id: string) => void
  uploadPhoto: (file: File) => Promise<string>
}) {
  const [mode, setMode] = useState<'idle' | 'create' | { edit: string }>('idle')
  const [uploading, setUploading] = useState(false)
  const [draftPhotos, setDraftPhotos] = useState<string[]>([])
  const [deleteTarget, setDeleteTarget] = useState<Moment | null>(null)

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const urls = await Promise.all(Array.from(files).map(uploadPhoto))
      setDraftPhotos((p) => [...p, ...urls])
    } finally {
      setUploading(false)
    }
  }

  function removeDraftPhoto(url: string) {
    setDraftPhotos((p) => p.filter((x) => x !== url))
  }

  function startCreate() {
    setDraftPhotos([])
    setMode('create')
  }

  function startEdit(m: Moment) {
    setDraftPhotos(m.photos)
    setMode({ edit: m.id })
  }

  function cancel() {
    setMode('idle')
    setDraftPhotos([])
  }

  function confirmDelete() {
    if (deleteTarget) onRemoveMoment(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="min-h-screen px-5 pb-28 pt-24">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-script text-3xl text-blush-700 dark:text-blush-300">Nuestros momentos</h1>
        {mode === 'idle' && (
          <button
            onClick={startCreate}
            className="rounded-full bg-blush-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blush-600"
          >
            + Agregar
          </button>
        )}
      </div>

      {mode === 'create' && (
        <MomentEditor
          initial={{ title: '', date: '', description: '' }}
          photos={draftPhotos}
          uploading={uploading}
          onUpload={handleUpload}
          onRemovePhoto={removeDraftPhoto}
          submitLabel="Guardar momento"
          onCancel={cancel}
          onSubmit={(values) => {
            onAddMoment(values)
            cancel()
          }}
        />
      )}

      <div className="space-y-5">
        {moments.map((m) =>
          typeof mode === 'object' && mode.edit === m.id ? (
            <MomentEditor
              key={m.id}
              initial={{ title: m.title, date: m.date, description: m.description }}
              photos={draftPhotos}
              uploading={uploading}
              onUpload={handleUpload}
              onRemovePhoto={removeDraftPhoto}
              submitLabel="Guardar cambios"
              onCancel={cancel}
              onSubmit={(values) => {
                onUpdateMoment(m.id, values)
                cancel()
              }}
            />
          ) : (
            <div
              key={m.id}
              className="overflow-hidden rounded-2xl border border-blush-200 bg-white/70 shadow-sm dark:border-blush-800 dark:bg-blush-950/50"
            >
              {m.photos.length > 0 && (
                <div className="flex gap-1 overflow-x-auto p-1">
                  {m.photos.map((p, i) => (
                    <img key={i} src={p} className="h-40 w-40 shrink-0 rounded-xl object-cover" />
                  ))}
                </div>
              )}
              <div className="p-4">
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="font-semibold text-blush-700 dark:text-blush-200">{m.title}</h3>
                  {m.date && (
                    <span className="text-xs text-blush-400 dark:text-blush-400/80">
                      {new Date(m.date).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
                {m.description && <p className="mb-3 text-sm text-blush-600 dark:text-blush-300/90">{m.description}</p>}
                <div className="flex gap-4 text-xs font-medium">
                  <button onClick={() => startEdit(m)} className="text-blush-500 underline decoration-dotted">
                    editar
                  </button>
                  <button onClick={() => setDeleteTarget(m)} className="text-blush-400 underline decoration-dotted">
                    borrar
                  </button>
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-blush-950"
          >
            <div className="mb-2 text-3xl">🥺</div>
            <p className="mb-5 text-sm text-blush-700 dark:text-blush-200">
              ¿Borrar <span className="font-semibold">"{deleteTarget.title}"</span>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2">
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-blush-500 py-2 text-sm font-semibold text-white hover:bg-blush-600"
              >
                Sí, borrar
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-blush-200 py-2 text-sm font-medium text-blush-500 dark:border-blush-800"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
