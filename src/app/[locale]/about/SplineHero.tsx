'use client'

interface SplineHeroProps {
  title: string
  subtitle: string
}

export function SplineHero({ title, subtitle }: SplineHeroProps) {
  return (
    <section className="relative w-full min-h-[400px] md:min-h-[500px] lg:min-h-[560px] -mx-4 md:-mx-6 overflow-hidden">
      {/* Spline viewer background — full bleed */}
      <div className="absolute inset-0 z-0">
        <iframe
          src="https://my.spline.design/spiraldna-uxGjS8Q2SUpDHhWhcMy6yQN1/"
          className="w-full h-full border-0 scale-110"
          style={{ pointerEvents: 'none' }}
          loading="lazy"
          title="Animated background"
        />
      </div>

      {/* Dark gradient overlays for text readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-background/80 to-transparent" />

      {/* Content positioned at bottom-left */}
      <div className="absolute inset-0 z-[2] flex items-end">
        <div className="px-4 md:px-6 pb-10 md:pb-14 lg:pb-16 max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-[0.9]">
            {title}
          </h1>
          <p className="font-sans text-base md:text-lg lg:text-xl text-white/70 leading-relaxed mt-6 max-w-xl">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  )
}
