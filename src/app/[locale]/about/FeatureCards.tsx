'use client'

import { motion } from 'framer-motion'
import { Shield, Clock, Globe, Newspaper, Users, Zap, type LucideIcon } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'

interface Feature {
  icon: LucideIcon
  title: string
  desc: string
}

interface FeatureCardsProps {
  features: { title: string; desc: string; iconName: string }[]
}

const iconMap: Record<string, LucideIcon> = {
  Shield, Clock, Globe, Newspaper, Users, Zap
}

export function FeatureCards({ features }: FeatureCardsProps) {
  const prefersReduced = useReducedMotion()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {features.map((feature, i) => {
        const Icon = iconMap[feature.iconName] || Shield

        const card = (
          <div className="group relative p-6 md:p-8 rounded-lg bg-card border border-border/50 overflow-hidden hover:border-primary/30 transition-colors duration-200">
            {/* Large background icon — decorative, creates depth */}
            <Icon className="absolute -right-4 -bottom-4 h-32 w-32 text-primary/[0.04] group-hover:text-primary/[0.08] transition-colors duration-500" strokeWidth={1} />

            {/* Content */}
            <div className="relative z-10">
              <Icon className="h-6 w-6 text-primary mb-4" />
              <h3 className="font-display text-sm font-bold uppercase tracking-tight text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          </div>
        )

        if (prefersReduced) return <div key={feature.title}>{card}</div>

        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: [0, 0, 0.2, 1] }}
          >
            {card}
          </motion.div>
        )
      })}
    </div>
  )
}
