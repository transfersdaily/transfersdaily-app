import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const transferStatusVariants = {
  completed: "transfer-status-completed",
  rumor: "transfer-status-rumor", 
  confirmed: "transfer-status-confirmed",
  loan: "transfer-status-loan",
  "done-deal": "transfer-status-completed", // Alias for completed
  "pending": "transfer-status-rumor", // Alias for rumor
} as const

export const leagueVariants = {
  "premier-league": "league-premier-league",
  "la-liga": "league-la-liga", 
  "bundesliga": "league-bundesliga",
  "serie-a": "league-serie-a",
  "ligue-1": "league-ligue-1",
} as const

export const buttonVariants = {
  completed: "btn-transfer-completed",
  rumor: "btn-transfer-rumor", 
  confirmed: "btn-transfer-confirmed",
  "done-deal": "btn-transfer-completed", // Alias
} as const

export const cardVariants = {
  elevated: "card-elevated",
  interactive: "card-interactive", 
  gradient: "bg-gradient-card",
} as const

export const textVariants = {
  hero: "text-hero",
  sectionTitle: "text-section-title", 
  cardTitle: "text-card-title",
  meta: "text-meta",
} as const

export const hoverVariants = {
  lift: "hover-lift",
  scale: "hover-scale",
  glow: "hover-glow",
} as const

export function getTransferStatusClass(status: string): string {
  const normalizedStatus = status.toLowerCase().replace(/[^a-z-]/g, '-') as keyof typeof transferStatusVariants
  return transferStatusVariants[normalizedStatus] || transferStatusVariants.rumor
}

export function getLeagueClass(league: string): string {
  const normalizedLeague = league.toLowerCase().replace(/\s+/g, '-') as keyof typeof leagueVariants
  return leagueVariants[normalizedLeague] || ""
}

export function getTransferButtonClass(status: string): string {
  const normalizedStatus = status.toLowerCase().replace(/[^a-z-]/g, '-') as keyof typeof buttonVariants
  return buttonVariants[normalizedStatus] || buttonVariants.rumor
}

export const modernShadows = {
  card: "shadow-lg hover:shadow-xl transition-shadow duration-300",
  elevated: "shadow-xl hover:shadow-2xl transition-shadow duration-300", 
  glow: "shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-shadow duration-300",
  success: "shadow-lg shadow-green-500/10 hover:shadow-green-500/20 transition-shadow duration-300",
  warning: "shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-shadow duration-300",
  error: "shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-shadow duration-300",
} as const

export const animations = {
  fadeIn: "animate-fade-in",
  fadeInUp: "animate-fade-in-up", 
  shimmer: "skeleton-gradient",
  delay100: "animation-delay-100",
  delay200: "animation-delay-200",
} as const

export const spacing = {
  section: "py-12 md:py-16 lg:py-20",
  sectionSmall: "py-8 md:py-12",
  card: "p-6 md:p-8",
  cardSmall: "p-4 md:p-6",
} as const

export const layout = {
  container: "container mx-auto px-4 sm:px-6 lg:px-8",
  maxWidth: "max-w-7xl mx-auto",
  centered: "flex items-center justify-center",
  grid2: "grid grid-cols-1 md:grid-cols-2 gap-6",
  grid3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", 
  grid4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
} as const

export const borders = {
  modern: "border border-border/50 hover:border-border transition-colors",
  accent: "border-l-4 border-primary",
  success: "border-l-4 border-green-500",
  warning: "border-l-4 border-yellow-500", 
  error: "border-l-4 border-red-500",
} as const

export const focus = {
  modern: "focus-modern",
  ring: "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
} as const

export function buildComponentClasses(
  base: string,
  variants?: Record<string, string>,
  className?: string
): string {
  return cn(base, variants && Object.values(variants).join(" "), className)
}

export const TRANSFER_STATUS_CONFIG = {
  completed: {
    label: "Completed",
    color: "green",
    variant: "completed" as const,
  },
  "done-deal": {
    label: "Done Deal", 
    color: "green",
    variant: "completed" as const,
  },
  confirmed: {
    label: "Confirmed",
    color: "blue", 
    variant: "confirmed" as const,
  },
  rumor: {
    label: "Rumor",
    color: "yellow",
    variant: "rumor" as const,
  },
  pending: {
    label: "Pending",
    color: "yellow",
    variant: "rumor" as const,
  },
  loan: {
    label: "Loan",
    color: "purple",
    variant: "loan" as const,
  },
} as const

export const LEAGUE_CONFIG = {
  "premier-league": {
    name: "Premier League",
    color: "#37003c",
    short: "EPL",
  },
  "la-liga": {
    name: "La Liga", 
    color: "#ee2737",
    short: "ESP",
  },
  "bundesliga": {
    name: "Bundesliga",
    color: "#000000",
    short: "GER", 
  },
  "serie-a": {
    name: "Serie A",
    color: "#005499",
    short: "ITA",
  },
  "ligue-1": {
    name: "Ligue 1",
    color: "#003399", 
    short: "FRA",
  },
} as const