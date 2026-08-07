// Any image dropped into src/assets/home-bg/ automatically joins the mosaic —
// no code changes needed. Until real photos are added, elegant gradient
// tiles fill the grid instead so the layout still looks intentional.
const photoModules = import.meta.glob('../assets/home-bg/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const photos = Object.values(photoModules)

const FALLBACK_GRADIENTS = [
  'from-[#e8b9a8] to-[#d98a7a]',
  'from-[#caa6c0] to-[#8f6a9a]',
  'from-[#f0d6a8] to-[#dba85a]',
  'from-[#9fc9d3] to-[#5a8fa0]',
  'from-[#e8a8b8] to-[#c0526f]',
  'from-[#a8c9a0] to-[#5f8f57]',
]

const CELLS = 12

export function PhotoMosaicBackground() {
  const cells = Array.from({ length: CELLS }, (_, i) => i)

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-blush-50">
      <div className="grid h-full w-full grid-cols-3 grid-rows-4 gap-[3px]">
        {cells.map((i) =>
          photos.length > 0 ? (
            <div
              key={i}
              className="bg-cover bg-center saturate-[0.9]"
              style={{ backgroundImage: `url(${photos[i % photos.length]})` }}
            />
          ) : (
            <div key={i} className={`bg-gradient-to-br ${FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length]}`} />
          ),
        )}
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,241,244,0.35) 0%, rgba(255,228,233,0.78) 55%, rgba(255,214,226,0.94) 100%)',
        }}
      />
    </div>
  )
}
