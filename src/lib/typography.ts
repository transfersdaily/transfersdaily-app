// Typography system for consistent text sizing across the application
// Editorial serif/sans pairing: Newsreader (serif) for headings, Roboto (sans) for body
// Mobile-first approach with responsive breakpoints

export const typography = {
  // Headings - Editorial Newsreader serif, bold weight hierarchy
  heading: {
    hero: "font-serif text-[clamp(1.75rem,5vw,4rem)] font-black leading-[1.1] tracking-[-0.05em]",
    h1: "font-serif text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight",
    h2: "font-serif text-xl md:text-2xl lg:text-3xl font-semibold leading-tight tracking-tight",
    h3: "font-serif text-lg md:text-xl lg:text-2xl font-semibold leading-snug",
    h4: "font-serif text-base md:text-lg font-semibold leading-snug",
    h5: "font-serif text-sm md:text-base font-semibold leading-normal",
    h6: "font-serif text-sm font-semibold leading-normal",
  },

  // Body text - Roboto sans-serif for readability
  body: {
    large: "font-sans text-base md:text-lg leading-relaxed",
    base: "font-sans text-sm md:text-base leading-normal",
    small: "font-sans text-xs md:text-sm leading-normal",
    xs: "font-sans text-xs leading-normal",
  },

  // Navigation and UI elements
  nav: {
    primary: "font-sans text-sm font-medium",
    secondary: "font-sans text-xs font-medium",
    dropdown: "font-sans text-sm",
  },

  // Interactive elements
  button: {
    large: "font-sans text-base font-medium",
    default: "font-sans text-sm font-medium",
    small: "font-sans text-xs font-medium",
  },

  // Special elements
  badge: "font-sans text-xs font-semibold",
  caption: "font-sans text-xs text-muted-foreground",
  label: "font-sans text-sm font-medium",

  // Article-specific - Editorial reading experience
  article: {
    title: "font-serif text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight",
    subtitle: "font-sans text-base md:text-lg text-muted-foreground leading-relaxed",
    body: "font-sans text-base md:text-lg leading-relaxed max-w-prose",
    meta: "font-sans text-xs md:text-sm text-muted-foreground",
  },

  // Card-specific
  card: {
    title: "font-serif text-sm md:text-base font-semibold leading-tight",
    description: "font-sans text-xs md:text-sm text-muted-foreground leading-normal",
    meta: "font-sans text-xs text-muted-foreground",
  },

  // Logo sizing
  logo: {
    navbar: "font-serif text-xl md:text-2xl font-bold tracking-tight",
  },
}

// Helper functions for common combinations
export const getHeadingClass = (level: keyof typeof typography.heading) => typography.heading[level]
export const getBodyClass = (size: keyof typeof typography.body) => typography.body[size]
export const getNavClass = (type: keyof typeof typography.nav) => typography.nav[type]
export const getButtonClass = (size: keyof typeof typography.button) => typography.button[size]

// Mobile-specific responsive utilities
export const responsive = {
  pageTitle: "font-serif text-xl md:text-2xl lg:text-3xl font-bold tracking-tight",
  sectionTitle: "font-serif text-lg md:text-xl lg:text-2xl font-bold tracking-tight",
  cardTitle: "font-serif text-sm md:text-base font-semibold leading-tight",
}

// Mobile-specific classes for critical components
export const mobile = {
  // Touch targets - Ensure minimum 44px height
  touchTarget: "min-h-[44px] flex items-center",

  // Content spacing - Mobile-optimized
  contentPadding: "px-4 md:px-6 lg:px-8",
  cardPadding: "p-3 md:p-4",

  // Mobile-friendly aspect ratios
  cardAspect: "aspect-[16/9] md:aspect-[4/3]",

  // Mobile typography combinations
  cardContent: {
    title: "font-serif text-sm md:text-base font-semibold leading-tight",
    description: "font-sans text-xs md:text-sm text-muted-foreground leading-normal mt-1",
    meta: "font-sans text-xs text-muted-foreground mt-2",
  },

  // Article mobile optimizations
  articleContent: {
    title: "font-serif text-xl md:text-2xl lg:text-3xl font-bold leading-tight mb-3 md:mb-4 tracking-tight",
    body: "font-sans text-base md:text-lg leading-relaxed space-y-3 md:space-y-4",
    meta: "font-sans text-xs md:text-sm text-muted-foreground",
  },
}
