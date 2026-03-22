// Typography system — Oswald (display/headlines) + Inter (body/UI)
// Compact, bold, modern sports media typography inspired by Ligue 1

export const typography = {
  // Headings — Oswald display font, condensed bold
  heading: {
    hero: "font-display text-[clamp(1.5rem,4vw,3rem)] font-bold uppercase leading-none tracking-tight",
    h1: "font-display text-2xl md:text-3xl lg:text-4xl font-bold uppercase leading-none tracking-tight",
    h2: "font-display text-xl md:text-2xl lg:text-3xl font-bold uppercase leading-none tracking-tight",
    h3: "font-display text-lg md:text-xl font-semibold uppercase leading-tight tracking-tight",
    h4: "font-display text-base md:text-lg font-semibold uppercase leading-tight tracking-tight",
    h5: "font-sans text-xs md:text-sm font-semibold uppercase tracking-wide",
    h6: "font-sans text-xs font-semibold uppercase tracking-wide",
  },

  // Body text — Inter for readability
  body: {
    large: "font-sans text-base md:text-lg leading-relaxed",
    base: "font-sans text-sm md:text-base leading-normal",
    small: "font-sans text-xs md:text-sm leading-normal",
    xs: "font-sans text-xs leading-normal",
  },

  // Navigation — compact, clean
  nav: {
    primary: "font-sans text-xs font-semibold uppercase tracking-wide",
    secondary: "font-sans text-xs font-medium uppercase tracking-wide",
    dropdown: "font-sans text-sm",
  },

  // Buttons
  button: {
    large: "font-sans text-base font-semibold",
    default: "font-sans text-sm font-semibold",
    small: "font-sans text-xs font-semibold",
  },

  // Special elements
  badge: "font-sans text-[10px] font-bold uppercase tracking-wide",
  caption: "font-sans text-xs text-muted-foreground",
  label: "font-sans text-sm font-medium",

  // Article-specific
  article: {
    title: "font-display text-xl md:text-3xl lg:text-4xl font-bold uppercase leading-none tracking-tight",
    subtitle: "font-sans text-sm md:text-base text-muted-foreground leading-relaxed",
    body: "font-sans text-base md:text-lg leading-relaxed max-w-prose",
    meta: "font-sans text-xs md:text-sm text-muted-foreground",
  },

  // Card-specific — bold titles, clean meta
  card: {
    title: "font-sans text-sm md:text-base font-bold leading-tight",
    description: "font-sans text-xs md:text-sm text-muted-foreground leading-normal",
    meta: "font-sans text-[11px] text-muted-foreground uppercase tracking-wide",
  },

  // Section titles — compact, punchy
  section: {
    title: "font-display text-lg md:text-xl font-bold uppercase tracking-tight",
    subtitle: "font-sans text-xs text-muted-foreground",
  },

  // Logo — clean, bold
  logo: {
    navbar: "font-display text-lg md:text-xl font-bold uppercase tracking-tight",
  },
}

export const getHeadingClass = (level: keyof typeof typography.heading) => typography.heading[level]
export const getBodyClass = (size: keyof typeof typography.body) => typography.body[size]
export const getNavClass = (type: keyof typeof typography.nav) => typography.nav[type]
export const getButtonClass = (size: keyof typeof typography.button) => typography.button[size]

export const responsive = {
  pageTitle: "font-display text-xl md:text-2xl lg:text-3xl font-bold uppercase leading-none tracking-tight",
  sectionTitle: "font-display text-lg md:text-xl font-bold uppercase tracking-tight",
  cardTitle: "font-sans text-sm md:text-base font-bold leading-tight",
}

export const mobile = {
  touchTarget: "min-h-[44px] flex items-center",
  contentPadding: "px-4 md:px-6 lg:px-8",
  cardPadding: "p-3 md:p-4",
  cardAspect: "aspect-[16/9] md:aspect-[4/3]",
  cardContent: {
    title: "font-sans text-sm md:text-base font-bold leading-tight",
    description: "font-sans text-xs md:text-sm text-muted-foreground leading-normal mt-1",
    meta: "font-sans text-[11px] text-muted-foreground uppercase tracking-wide mt-2",
  },
  articleContent: {
    title: "font-display text-xl md:text-2xl lg:text-3xl font-bold uppercase leading-none tracking-tight mb-3 md:mb-4",
    body: "font-sans text-base md:text-lg leading-relaxed space-y-3 md:space-y-4",
    meta: "font-sans text-xs md:text-sm text-muted-foreground",
  },
}
