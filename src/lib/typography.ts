// Typography system for consistent text sizing across the application
// Based on modern design principles with proper hierarchy

export const typography = {
  // Headings - Progressive scale for clear hierarchy (reduced sizes)
  heading: {
    h1: "text-2xl font-bold leading-tight tracking-tight", // Main page titles (reduced from 3xl)
    h2: "text-xl font-semibold leading-tight tracking-tight", // Section titles (reduced from 2xl)
    h3: "text-lg font-semibold leading-snug", // Subsection titles (reduced from xl)
    h4: "text-base font-semibold leading-snug", // Card titles, smaller sections (reduced from lg)
    h5: "text-sm font-semibold leading-normal", // Small headings (reduced from base)
    h6: "text-xs font-semibold leading-normal", // Tiny headings (reduced from sm)
  },

  // Body text - Optimized for readability
  body: {
    large: "text-lg leading-relaxed", // Article content, important descriptions
    base: "text-base leading-normal", // Default body text, card descriptions
    small: "text-sm leading-normal", // Secondary text, metadata
    xs: "text-xs leading-normal", // Labels, badges, timestamps
  },

  // Navigation and UI elements
  nav: {
    primary: "text-sm font-medium", // Main navigation links
    secondary: "text-xs font-medium", // Secondary navigation, breadcrumbs
    dropdown: "text-sm", // Dropdown menu items
  },

  // Interactive elements
  button: {
    large: "text-base font-medium",
    default: "text-sm font-medium", 
    small: "text-xs font-medium",
  },

  // Special elements
  badge: "text-xs font-semibold",
  caption: "text-xs text-muted-foreground",
  label: "text-sm font-medium",
  
  // Article-specific
  article: {
    title: "text-2xl font-bold leading-tight tracking-tight", // Article page title (reduced from 3xl)
    subtitle: "text-lg text-muted-foreground leading-normal", // Article subtitle (reduced from xl)
    body: "text-base leading-relaxed", // Article content
    meta: "text-sm text-muted-foreground", // Author, date, etc.
  },

  // Card-specific
  card: {
    title: "text-base font-semibold leading-tight", // Card titles (reduced from lg)
    description: "text-sm text-muted-foreground leading-normal", // Card descriptions
    meta: "text-xs text-muted-foreground", // Card metadata
  },

  // Logo sizing
  logo: {
    navbar: "text-2xl font-bold", // Increased from xl to be larger than headings
  }
}

// Helper functions for common combinations
export const getHeadingClass = (level: keyof typeof typography.heading) => typography.heading[level]
export const getBodyClass = (size: keyof typeof typography.body) => typography.body[size]
export const getNavClass = (type: keyof typeof typography.nav) => typography.nav[type]
export const getButtonClass = (size: keyof typeof typography.button) => typography.button[size]

// Responsive typography utilities
export const responsive = {
  // Page titles that are consistent across all pages (matching latest page)
  pageTitle: "text-xl font-bold", // Standardized to match latest page
  // Section titles for homepage sections
  sectionTitle: "text-xl font-bold", // Same as page titles for consistency
  // Card titles that remain consistent
  cardTitle: "text-base font-semibold leading-tight", // Reduced from lg
}
