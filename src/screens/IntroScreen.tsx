import { motion } from 'framer-motion'
import { AmbientBlobs } from '../components/AmbientBlobs'
import { pageVariants, staggerContainer, staggerItem } from '../lib/motion'

export function IntroScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      <AmbientBlobs />
      <motion.div variants={pageVariants} initial="hidden" animate="visible" className="w-full max-w-sm">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={staggerItem} className="mb-4 text-5xl">
            💌
          </motion.div>

          <motion.div variants={staggerItem} className="mb-8 space-y-4 text-left text-sm leading-relaxed text-blush-700">
            <p>Hola Fabi,</p>
            <p>
              Hice esto con mucho amor para que nos quede para toda la vida. Agradezco mucho haberte encontrado y
              estar en esta relación llena de true love. Estuve mucho tiempo pidiéndole a la vida señales, que me
              preparara para la persona correcta, y desde aquella vez que nos vimos en la playa negra a inicio de
              año, supe que era una señal.
            </p>
            <p>
              Eres una persona increíble, graciosa, romántica y cariñosa; todo lo que busco en una compañera de
              vida. No soy perfecto, pero sé que puedo estar para ti en lo que necesites, y quiero que seas parte
              de mi vida.
            </p>
            <p>
              Me gusta mucho pasar el tiempo contigo; genuinamente eres muy graciosa e inteligente, cualidades y
              dones que quiero en mi vida. Espero poder seguir sumando más tiempo juntos. Sé que no siempre van a
              ser buenos tiempos, pero sé que podemos con todo, princesa.
            </p>
            <p>Por eso quiero que pases a la siguiente pantalla...</p>
          </motion.div>

          <motion.button
            variants={staggerItem}
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
            className="glass-button w-full rounded-2xl px-5 py-3 text-lg font-semibold transition hover:brightness-105"
          >
            Continuar 💗
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
