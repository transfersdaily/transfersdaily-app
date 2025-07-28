"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/Sidebar"
import { Menu, X } from "lucide-react"
import { type Locale, type Dictionary } from "@/lib/i18n"

interface MobileSidebarDrawerProps {
  locale: Locale
  dict: Dictionary
}

export function MobileSidebarDrawer({ locale, dict }: MobileSidebarDrawerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden fixed bottom-24 right-4 z-40">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            size="icon" 
            className="bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 h-12 w-12"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">More Content</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="overflow-y-auto h-full">
            <Sidebar className="border-0 bg-transparent -mr-0 pr-0" locale={locale} dict={dict} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}