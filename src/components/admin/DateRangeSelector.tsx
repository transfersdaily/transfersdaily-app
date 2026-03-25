'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DATE_RANGE_OPTIONS, type DateRange } from '@/types/analytics'

interface DateRangeSelectorProps {
  days: DateRange
  onDaysChange: (days: DateRange) => void
}

export function DateRangeSelector({ days, onDaysChange }: DateRangeSelectorProps) {
  return (
    <Select value={days} onValueChange={(v) => onDaysChange(v as DateRange)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {DATE_RANGE_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
