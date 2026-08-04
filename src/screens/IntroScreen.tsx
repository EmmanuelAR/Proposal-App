import { motion } from 'framer-motion'

export function IntroScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blush-100 via-blush-50 to-white px-6 py-12 text-center dark:from-blush-950 dark:via-[#1a0a10] dark:to-[#120609]">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="mb-4 text-5xl">💌</div>

        <div className="mb-8 space-y-4 text-left text-sm leading-relaxed text-blush-700 dark:text-blush-200/90">
          <p>Hola Fabi,</p>
          <p>
            Hice esto con mucho amor para que nos quede para toda la vida. Agradezco mucho haberte encontrado y estar
            en esta relación llena de true love. Estuve mucho tiempo pidiéndole a la vida señales, que me preparara
            para la persona correcta, y desde aquella vez que nos vimos en la playa negra a inicio de año, supe que
            era una señal.
          </p>
          <p>
            Eres una persona increíble, graciosa, romántica y cariñosa; todo lo que busco en una compañera de vida.
            No soy perfecto, pero sé que puedo estar para ti en lo que necesites, y quiero que seas parte de mi
            vida.
          </p>
          <p>Por eso quiero que pases a la siguiente pantalla...</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="w-full rounded-2xl bg-blush-500 px-5 py-3 text-lg font-semibold text-white shadow-lg shadow-blush-500/30 transition hover:bg-blush-600"
        >
          Continuar 💗
        </motion.button>
      </motion.div>
    </div>
  )
}
