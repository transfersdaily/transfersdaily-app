'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface SplineHeroProps {
  title: string
  subtitle: string
}

export function SplineHero({ title, subtitle }: SplineHeroProps) {
  const prefersReduced = useReducedMotion()

  return (
    <section className="relative w-full min-h-[400px] md:min-h-[500px] lg:min-h-[560px] -mx-4 md:-mx-6 overflow-hidden bg-background">
      {/* Spline viewer — CSS filtered to red/maroon on black */}
      <div className="absolute inset-0 z-0 opacity-50 mix-blend-screen">
        <iframe
          src="https://my.spline.design/spiraldna-uxGjS8Q2SUpDHhWhcMy6yQN1/"
          className="w-full h-full border-0 scale-125"
          style={{ pointerEvents: 'none', filter: 'hue-rotate(320deg) saturate(2) brightness(0.7)' }}
          loading="lazy"
          title="Animated background"
        />
      </div>

      {/* Dark edges — keep background black, DNA visible in center */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-background via-transparent to-background/80" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-background/90 via-transparent to-background/90" />

      {/* Content */}
      <div className="absolute inset-0 z-[2] flex items-end">
        <div className="px-4 md:px-6 pb-10 md:pb-14 lg:pb-16 max-w-3xl">
          <motion.h1
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-[0.9]"
            initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="font-sans text-base md:text-lg lg:text-xl text-white/70 leading-relaxed mt-6 max-w-xl"
            initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0, 0, 0.2, 1] }}
          >
            {subtitle}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
