import { Badge } from "@/components/ui/badge"

interface LeagueHeroProps {
  logoSrc: string
  logoAlt: string
  badgeText: string
  title: string
  description: string
  accentColor?: string
}

export function LeagueHero({
  logoSrc,
  logoAlt,
  badgeText,
  title,
  description,
  accentColor = "primary"
}: LeagueHeroProps) {
  const gradientClass = accentColor === "purple" ? "from-purple-500/10 via-background to-purple-600/5" :
                       accentColor === "orange" ? "from-orange-500/10 via-background to-orange-600/5" :
                       accentColor === "green" ? "from-green-500/10 via-background to-green-600/5" :
                       accentColor === "red" ? "from-red-500/10 via-background to-red-600/5" :
                       accentColor === "blue" ? "from-blue-500/10 via-background to-blue-600/5" :
                       "from-primary/5 via-background to-primary/10"

  return (
    <section className={`relative bg-gradient-to-br ${gradientClass} py-16 overflow-hidden`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src={logoSrc}
              alt={logoAlt}
              className="w-16 h-16 object-contain"
            />
            <div>
              <Badge variant="outline" className="mb-2">{badgeText}</Badge>
              <h1 className="text-4xl font-bold">{title}</h1>
            </div>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}
