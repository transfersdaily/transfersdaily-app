import { Footer } from '@/components/Footer'
import { type Locale, type Dictionary } from '@/lib/i18n'
import { createTranslator } from '@/lib/dictionary-provider'

interface ServerFooterProps {
  locale: Locale
  dictionary: Dictionary
}

export function ServerFooter({ locale, dictionary }: ServerFooterProps) {
  const t = createTranslator(dictionary)
  
  return <Footer />
}
