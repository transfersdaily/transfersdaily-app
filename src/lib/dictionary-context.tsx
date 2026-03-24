'use client'

import { createContext, useContext } from 'react'
import { type Dictionary } from './i18n'
import { createTranslator } from './dictionary-provider'

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
