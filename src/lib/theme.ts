import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { LEAGUES } from "@/lib/constants"

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

export const LEAGUE_CONFIG = Object.fromEntries(
  LEAGUES.map(l => [l.slug, { name: l.name, color: l.color, short: l.short }])
) as Record<string, { name: string; color: string; short: string }>

// Spacing tokens (4pt/8dp grid) — reference for component authors
export const spacingScale = {
  xs: "4px",   // --space-1
  sm: "8px",   // --space-2
  md: "16px",  // --space-4
  lg: "24px",  // --space-6
  xl: "32px",  // --space-8
  "2xl": "48px", // --space-12
  "3xl": "64px", // --space-16
} as const

// Z-index scale — use instead of arbitrary z-values
export const zIndex = {
  base: "z-0",
  dropdown: "z-10",
  sticky: "z-20",
  overlay: "z-40",
  modal: "z-[100]",
  toast: "z-[1000]",
} as const

// Animation token classes — consistent timing across all components
export const motion = {
  // Duration classes
  fast: "duration-fast",       // 150ms
  normal: "duration-normal",   // 200ms
  slow: "duration-slow",       // 300ms
  complex: "duration-complex", // 400ms
  // Easing classes
  easeDefault: "ease-default",
  easeIn: "ease-in",
  easeOut: "ease-out",
  // Preset animations
  fadeIn: "animate-fade-in",
  fadeInUp: "animate-fade-in-up",
  slideInRight: "animate-slide-in-right",
  // Reduced motion helper
  respectMotion: "motion-safe:transition-all motion-reduce:transition-none",
} as const

// Editorial layout helpers — generous whitespace for magazine feel
export const editorial = {
  sectionDesktop: "py-16 lg:py-20",    // Spacious sections on desktop
  sectionMobile: "py-8 md:py-12",       // Tighter on mobile (30-40% reduction)
  articleWidth: "max-w-prose mx-auto",   // 65ch optimal reading width
  heroSpacing: "py-12 md:py-16 lg:py-24", // Extra space around hero content
} as const