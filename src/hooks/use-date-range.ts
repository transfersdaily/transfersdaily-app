'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import type { DateRange } from '@/types/analytics'

export function useDateRange() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const daysParam = (searchParams.get('days') || '30') as DateRange

  const setDays = (newDays: DateRange) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('days', newDays)
    router.push(`${pathname}?${params.toString()}`)
  }

  return { days: parseInt(daysParam), daysParam, setDays }
}
