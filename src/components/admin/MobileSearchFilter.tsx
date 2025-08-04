"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import { useIsMobile, adminMobileClasses, adminMobileTouchTargets } from "@/lib/mobile-utils"

interface FilterOption {
  key: string
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}

interface MobileSearchFilterProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  onSearch?: () => void
  onSearchKeyPress?: (e: React.KeyboardEvent) => void
  filters: FilterOption[]
  onResetFilters?: () => void
  className?: string
}

export function MobileSearchFilter({
  searchTerm,
  onSearchChange,
  onSearch,
  onSearchKeyPress,
  filters,
  onResetFilters,
  className = ""
}: MobileSearchFilterProps) {
  const isMobile = useIsMobile()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Count active filters
  const activeFiltersCount = filters.filter(filter => 
    filter.value && filter.value !== 'all' && filter.value !== ''
  ).length

  const MobileFilterSheet = () => (
    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={`${adminMobileTouchTargets.button} relative`}>
          <Filter className="w-4 h-4 mr-1" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Filter Options</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-6">
          {filters.map((filter) => (
            <div key={filter.key}>
              <label className="text-sm font-medium mb-2 block">{filter.label}</label>
              <Select value={filter.value} onValueChange={filter.onChange}>
                <SelectTrigger className={adminMobileTouchTargets.select}>
                  <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => {
                onResetFilters?.()
                setIsFilterOpen(false)
              }}
              variant="outline" 
              className="flex-1"
            >
              Reset All
            </Button>
            <Button 
              onClick={() => setIsFilterOpen(false)}
              className="flex-1"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  const DesktopFilters = () => (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
          <SelectTrigger className="w-[140px] focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      <Button 
        onClick={onResetFilters} 
        variant="outline" 
        size="sm" 
        className="border-red-500 text-red-600 hover:bg-red-50"
      >
        Reset
      </Button>
    </div>
  )

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={onSearchKeyPress}
            className={`pl-10 ${adminMobileTouchTargets.input}`}
          />
        </div>
        <Button 
          onClick={onSearch} 
          className={`${adminMobileTouchTargets.button} bg-blue-600 hover:bg-blue-700`}
        >
          Search
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-1">
            {filters
              .filter(filter => filter.value && filter.value !== 'all' && filter.value !== '')
              .map((filter) => {
                const selectedOption = filter.options.find(opt => opt.value === filter.value)
                return (
                  <Badge key={filter.key} variant="secondary" className="text-xs">
                    {filter.label}: {selectedOption?.label}
                    <button
                      onClick={() => filter.onChange('all')}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )
              })}
          </div>
        )}

        {/* Filter Controls */}
        <div className={isMobile ? '' : 'ml-auto'}>
          {isMobile ? <MobileFilterSheet /> : <DesktopFilters />}
        </div>
      </div>
    </div>
  )
}
