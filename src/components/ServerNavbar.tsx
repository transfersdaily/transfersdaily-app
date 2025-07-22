import { Navbar } from '@/components/navbar'
import { type Locale, type Dictionary } from '@/lib/i18n'

interface ServerNavbarProps {
  locale: Locale
  dictionary: Dictionary
}

export function ServerNavbar({ locale, dictionary }: ServerNavbarProps) {
  return <Navbar locale={locale} dict={dictionary} />
}
