export const defaultLocale = 'en' as const
export const locales = ['en', 'es', 'it', 'fr', 'de'] as const

export type Locale = typeof locales[number]

export const localeNames: Record<Locale, { name: string; nativeName: string; flag: string }> = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' }
}

// Dictionary type for translations
export type Dictionary = {
  [key: string]: string | Dictionary
}

// Get dictionary for a specific locale
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  try {
    const dict = await import(`../dictionaries/${locale}.json`)
    return dict.default
  } catch (error) {
    console.warn(`Dictionary for locale ${locale} not found, falling back to ${defaultLocale}`)
    const fallback = await import(`../dictionaries/${defaultLocale}.json`)
    return fallback.default
  }
}

// Utility to get nested translation
export function getTranslation(dict: Dictionary, key: string): string {
  const keys = key.split('.')
  let result: any = dict
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k]
    } else {
      return key // Return key if translation not found
    }
  }
  
  return typeof result === 'string' ? result : key
}

// Check if locale is valid
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

// Get locale from pathname
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  
  if (potentialLocale && isValidLocale(potentialLocale)) {
    return potentialLocale
  }
  
  return defaultLocale
}

// Remove locale from pathname
export function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  
  if (potentialLocale && isValidLocale(potentialLocale)) {
    return '/' + segments.slice(2).join('/')
  }
  
  return pathname
}

// Add locale to pathname
export function addLocaleToPathname(pathname: string, locale: Locale): string {
  if (locale === defaultLocale) {
    return pathname
  }
  
  const cleanPath = removeLocaleFromPathname(pathname)
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`
}
