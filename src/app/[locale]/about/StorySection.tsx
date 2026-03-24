'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface StorySectionProps {
  heading: string
  steps: { num: string; title: string; text: string }[]
}

export function StorySection({ heading, steps }: StorySectionProps) {
  const prefersReduced = useReducedMotion()

  return (
    <section className="py-12 md:py-16 border-t border-border">
      <motion.h2
        className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight text-foreground mb-10 md:mb-12"
        initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {heading}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.15, ease: [0, 0, 0.2, 1] }}
          >
            {/* Accent line + step number as label */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-primary" />
              <span className="font-sans text-xs font-medium text-primary uppercase tracking-widest">
                Step {step.num}
              </span>
            </div>

            <h3 className="font-display text-base md:text-lg font-bold uppercase tracking-tight text-foreground mb-3">
              {step.title}
            </h3>
            <p className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
              {step.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
