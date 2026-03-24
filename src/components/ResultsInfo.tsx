import { type Dictionary, getTranslation } from "@/lib/i18n"

interface ResultsInfoProps {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  isLoading: boolean
  dict?: Dictionary
}

export function ResultsInfo({ currentPage, itemsPerPage, totalItems, isLoading, dict }: ResultsInfoProps) {
  if (isLoading || totalItems === 0) return null

  const t = (key: string, fallback: string) => {
    if (dict) {
      const val = getTranslation(dict, key)
      if (val && val !== key) return val
    }
    return fallback
  }

  const startItem = ((currentPage - 1) * itemsPerPage) + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const text = t('common.showingResults', 'Showing {{start}}-{{end}} of {{total}} articles')
    .replace('{{start}}', String(startItem))
    .replace('{{end}}', String(endItem))
    .replace('{{total}}', String(totalItems))

  return (
    <div className="mb-4 text-sm text-muted-foreground">
      {text}
    </div>
  )
}
