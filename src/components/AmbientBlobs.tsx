/**
 * Soft, slow-moving blurred color blobs used as the ambient backdrop behind
 * glass surfaces — glassmorphism needs something with color/shape behind it
 * for the blur to actually read.
 */
export function AmbientBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-b from-blush-100 via-blush-50 to-white">
      <div className="absolute -left-24 -top-20 h-72 w-72 animate-blob-1 rounded-full bg-blush-300/60 blur-3xl" />
      <div className="absolute -right-20 top-1/3 h-64 w-64 animate-blob-2 rounded-full bg-gold-300/50 blur-3xl" />
      <div className="absolute -bottom-24 left-10 h-72 w-72 animate-blob-3 rounded-full bg-blush-400/50 blur-3xl" />
    </div>
  )
}
