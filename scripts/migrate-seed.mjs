// Sube las fotos semilla a Supabase Storage e inserta los momentos/app_state iniciales.
// Uso: npm run migrate:seed  (necesita .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY)
import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function loadEnv() {
  const envPath = join(root, '.env')
  if (!existsSync(envPath)) {
    console.error('No se encontró .env. Copia .env.example a .env y llena las llaves de Supabase.')
    process.exit(1)
  }
  const content = readFileSync(envPath, 'utf-8')
  const env = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim()
  }
  return env
}

const env = loadEnv()
const url = env.VITE_SUPABASE_URL
const anonKey = env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey || url.includes('tu-proyecto')) {
  console.error('Llena VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env con tus valores reales.')
  process.exit(1)
}

const supabase = createClient(url, anonKey)
const BUCKET = 'photos'

const SEED_MOMENTS = [
  { slug: 'primer-beso', title: 'Nuestro primer beso', date: '2026-01-17', description: 'El momento en el que todo se sintió distinto. Edita esta descripción con los detalles que quieras recordar.' },
  { slug: 'primer-cumple', title: 'Mi primer cumpleaños juntos', date: '2026-06-20', description: 'La primera vez que celebramos mi cumpleaños siendo nosotros dos. Edita esta descripción con los detalles que quieras recordar.' },
  { slug: 'primer-viaje', title: 'Nuestro primer viaje juntos', date: '2026-04-26', description: 'La primera aventura fuera de casa, los dos solos. Edita esta descripción con los detalles que quieras recordar.' },
  { slug: 'segundo-viaje-playa', title: 'Segundo viaje a la playa', date: '2026-06-08', description: 'De vuelta al mar, otra vez juntos. Edita esta descripción con los detalles que quieras recordar.' },
]

async function ensureAppState() {
  const { error } = await supabase.from('app_state').select('id').eq('id', 1).single()
  if (error) {
    console.error('No se pudo leer app_state. ¿Corriste supabase/schema.sql en el SQL Editor?', error.message)
    process.exit(1)
  }
}

async function migrateMoment(seed) {
  const dir = join(root, 'src', 'assets', 'moments', seed.slug)
  const files = readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.jpg')).sort()
  const urls = []
  for (const file of files) {
    const filePath = join(dir, file)
    const buffer = readFileSync(filePath)
    const storagePath = `seed/${seed.slug}/${file}`
    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
      contentType: 'image/jpeg',
      upsert: true,
    })
    if (error) {
      console.error(`Error subiendo ${storagePath}:`, error.message)
      continue
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
    urls.push(data.publicUrl)
    console.log(`  ✓ ${storagePath}`)
  }

  const { error: insertError } = await supabase.from('moments').insert({
    title: seed.title,
    date: seed.date,
    description: seed.description,
    photos: urls,
    seeded: true,
  })
  if (insertError) console.error(`Error insertando momento ${seed.title}:`, insertError.message)
  else console.log(`✓ Momento "${seed.title}" creado con ${urls.length} fotos`)
}

async function main() {
  await ensureAppState()

  const { data: existing } = await supabase.from('moments').select('id').eq('seeded', true)
  if (existing && existing.length > 0) {
    console.log('Ya hay momentos semilla en la base de datos. No se volverá a migrar (borra la tabla moments si quieres reiniciar).')
    return
  }

  for (const seed of SEED_MOMENTS) {
    console.log(`Migrando: ${seed.title}`)
    await migrateMoment(seed)
  }
  console.log('\n¡Listo! Revisa Supabase > Table Editor > moments y Storage > photos.')
}

main()
