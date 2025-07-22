import { type Locale, getDictionary, type Dictionary } from './i18n'

// Server-side dictionary provider
export async function getDictionaryServer(locale: Locale): Promise<Dictionary> {
  return await getDictionary(locale)
}

// Translation helper for server components
export function createTranslator(dict: Dictionary) {
  return function t(key: string, fallback?: string): string {
    const keys = key.split('.')
    let result: any = dict
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k]
      } else {
        return fallback || key
      }
    }
    
    return typeof result === 'string' ? result : (fallback || key)
  }
}
