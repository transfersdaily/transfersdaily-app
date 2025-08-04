// Typography system for consistent text sizing across the application
// Mobile-first approach with responsive breakpoints

export const typography = {
  // Headings - Mobile-first with responsive scaling
  heading: {
    h1: "text-lg md:text-xl lg:text-2xl font-bold leading-tight tracking-tight", // 18px -> 20px -> 24px
    h2: "text-base md:text-lg lg:text-xl font-semibold leading-tight tracking-tight", // 16px -> 18px -> 20px
    h3: "text-sm md:text-base lg:text-lg font-semibold leading-snug", // 14px -> 16px -> 18px
    h4: "text-sm md:text-base font-semibold leading-snug", // 14px -> 16px
    h5: "text-xs md:text-sm font-semibold leading-normal", // 12px -> 14px
    h6: "text-xs font-semibold leading-normal", // 12px
  },

  // Body text - Optimized for mobile readability
  body: {
    large: "text-base md:text-lg leading-relaxed", // Article content: 16px -> 18px
    base: "text-sm md:text-base leading-normal", // Default body: 14px -> 16px
    small: "text-xs md:text-sm leading-normal", // Secondary text: 12px -> 14px
    xs: "text-xs leading-normal", // Labels, badges: 12px
  },

  // Navigation and UI elements - Mobile-optimized
  nav: {
    primary: "text-sm font-medium", // Main navigation links
    secondary: "text-xs font-medium", // Secondary navigation, breadcrumbs
    dropdown: "text-sm", // Dropdown menu items
  },

  // Interactive elements - Touch-friendly sizing
  button: {
    large: "text-base font-medium",
    default: "text-sm font-medium", 
    small: "text-xs font-medium",
  },

  // Special elements
  badge: "text-xs font-semibold",
  caption: "text-xs text-muted-foreground",
  label: "text-sm font-medium",
  
  // Article-specific - Mobile-optimized reading experience
  article: {
    title: "text-lg md:text-xl lg:text-2xl font-bold leading-tight tracking-tight", // 18px -> 20px -> 24px
    subtitle: "text-base md:text-lg text-muted-foreground leading-normal", // 16px -> 18px
    body: "text-sm md:text-base leading-relaxed", // 14px -> 16px for better mobile reading
    meta: "text-xs md:text-sm text-muted-foreground", // 12px -> 14px
  },

  // Card-specific - Mobile-first density
  card: {
    title: "text-sm md:text-base font-semibold leading-tight", // 14px -> 16px
    description: "text-xs md:text-sm text-muted-foreground leading-normal", // 12px -> 14px
    meta: "text-xs text-muted-foreground", // 12px
  },

  // Logo sizing
  logo: {
    navbar: "text-xl md:text-2xl font-bold", // 20px -> 24px
  }
}

// Helper functions for common combinations
export const getHeadingClass = (level: keyof typeof typography.heading) => typography.heading[level]
export const getBodyClass = (size: keyof typeof typography.body) => typography.body[size]
export const getNavClass = (type: keyof typeof typography.nav) => typography.nav[type]
export const getButtonClass = (size: keyof typeof typography.button) => typography.button[size]

// Mobile-specific responsive utilities
export const responsive = {
  // Page titles - Mobile-first approach
  pageTitle: "text-base md:text-lg lg:text-xl font-bold", // 16px -> 18px -> 20px
  // Section titles for homepage sections
  sectionTitle: "text-base md:text-lg lg:text-xl font-bold", // Same as page titles
  // Card titles that scale appropriately
  cardTitle: "text-sm md:text-base font-semibold leading-tight", // 14px -> 16px
}

// Mobile-specific classes for critical components
export const mobile = {
  // Touch targets - Ensure minimum 44px height
  touchTarget: "min-h-[44px] flex items-center",
  
  // Content spacing - Mobile-optimized
  contentPadding: "px-4 md:px-6 lg:px-8",
  cardPadding: "p-3 md:p-4",
  
  // Mobile-friendly aspect ratios
  cardAspect: "aspect-[16/9] md:aspect-[4/3]", // Wider on mobile, square on desktop
  
  // Mobile typography combinations
  cardContent: {
    title: "text-sm md:text-base font-semibold leading-tight",
    description: "text-xs md:text-sm text-muted-foreground leading-normal mt-1",
    meta: "text-xs text-muted-foreground mt-2",
  },
  
  // Article mobile optimizations
  articleContent: {
    title: "text-lg md:text-xl lg:text-2xl font-bold leading-tight mb-3 md:mb-4",
    body: "text-sm md:text-base leading-relaxed space-y-3 md:space-y-4",
    meta: "text-xs md:text-sm text-muted-foreground",
  }
}
