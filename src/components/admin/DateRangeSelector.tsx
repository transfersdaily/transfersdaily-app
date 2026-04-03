'use client'

import { DATE_RANGE_OPTIONS, type DateRange } from '@/types/analytics'

interface DateRangeSelectorProps {
  days: DateRange
  onDaysChange: (days: DateRange) => void
}

export function DateRangeSelector({ days, onDaysChange }: DateRangeSelectorProps) {
  return (
    <div className="flex gap-1 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
      {DATE_RANGE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onDaysChange(opt.value)}
          className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
            days === opt.value
              ? "bg-white/[0.1] text-white shadow-sm"
              : "text-white/30 hover:text-white/50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
