'use client'
import { createContext, useContext } from 'react'
import { type Dictionary } from './i18n'

// Translation helper function
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

// Context for client components that need translations
const DictionaryContext = createContext<Dictionary>({})

export function DictionaryProvider({ 
  children, 
  dictionary 
}: { 
  children: React.ReactNode
  dictionary: Dictionary 
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  )
}

export function useDictionary() {
  const dict = useContext(DictionaryContext)
  return {
    dict,
    t: createTranslator(dict)
  }
}
