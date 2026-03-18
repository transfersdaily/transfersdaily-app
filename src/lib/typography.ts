// Typography system — Bebas Neue (display/headlines) + Source Sans 3 (body/UI)
// UI/UX Pro Max: Bold, impactful, strong, dramatic, modern, headlines

export const typography = {
  // Headings — Bebas Neue display font, uppercase, bold sports media feel
  heading: {
    hero: "font-display text-[clamp(2rem,6vw,4.5rem)] uppercase leading-none tracking-wide",
    h1: "font-display text-3xl md:text-4xl lg:text-5xl uppercase leading-none tracking-wide",
    h2: "font-display text-2xl md:text-3xl lg:text-4xl uppercase leading-none tracking-wide",
    h3: "font-display text-xl md:text-2xl uppercase leading-tight tracking-wide",
    h4: "font-display text-lg md:text-xl uppercase leading-tight tracking-wide",
    h5: "font-sans text-sm md:text-base font-semibold uppercase tracking-wider",
    h6: "font-sans text-xs font-semibold uppercase tracking-wider",
  },

  // Body text — Source Sans 3 for readability
  body: {
    large: "font-sans text-base md:text-lg leading-relaxed",
    base: "font-sans text-sm md:text-base leading-normal",
    small: "font-sans text-xs md:text-sm leading-normal",
    xs: "font-sans text-xs leading-normal",
  },

  // Navigation
  nav: {
    primary: "font-sans text-sm font-semibold uppercase tracking-wider",
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
  badge: "font-sans text-[10px] font-bold uppercase tracking-wider",
  caption: "font-sans text-xs text-muted-foreground",
  label: "font-sans text-sm font-medium",

  // Article-specific
  article: {
    title: "font-display text-2xl md:text-4xl lg:text-5xl uppercase leading-none tracking-wide",
    subtitle: "font-sans text-base md:text-lg text-muted-foreground leading-relaxed",
    body: "font-sans text-base md:text-lg leading-relaxed max-w-prose",
    meta: "font-sans text-xs md:text-sm text-muted-foreground",
  },

  // Card-specific — bold titles, clean meta
  card: {
    title: "font-sans text-sm md:text-base font-bold leading-tight",
    description: "font-sans text-xs md:text-sm text-muted-foreground leading-normal",
    meta: "font-sans text-[11px] text-muted-foreground uppercase tracking-wide",
  },

  // Section titles — Bebas Neue for homepage sections
  section: {
    title: "font-display text-xl md:text-2xl uppercase tracking-wide",
    subtitle: "font-sans text-sm text-muted-foreground",
  },

  // Logo — sans-serif, bold
  logo: {
    navbar: "font-sans text-xl md:text-2xl font-bold tracking-tight",
  },
}

export const getHeadingClass = (level: keyof typeof typography.heading) => typography.heading[level]
export const getBodyClass = (size: keyof typeof typography.body) => typography.body[size]
export const getNavClass = (type: keyof typeof typography.nav) => typography.nav[type]
export const getButtonClass = (size: keyof typeof typography.button) => typography.button[size]

export const responsive = {
  pageTitle: "font-display text-2xl md:text-3xl lg:text-4xl uppercase leading-none tracking-wide",
  sectionTitle: "font-display text-xl md:text-2xl uppercase tracking-wide",
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
    title: "font-display text-2xl md:text-3xl lg:text-4xl uppercase leading-none tracking-wide mb-3 md:mb-4",
    body: "font-sans text-base md:text-lg leading-relaxed space-y-3 md:space-y-4",
    meta: "font-sans text-xs md:text-sm text-muted-foreground",
  },
}
