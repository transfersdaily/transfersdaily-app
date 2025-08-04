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
        <SheetContent 
          side="right" 
          className="w-80 p-0 mobile-sidebar-container"
        >
          {/* Fixed Header */}
          <div className="mobile-sidebar-header flex items-center justify-between p-4">
            <h2 className="text-base md:text-lg font-semibold">More Content</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Scrollable Content Area */}
          <div className="mobile-sidebar-content">
            <div className="mobile-sidebar-inner">
              <Sidebar 
                className="border-0 bg-transparent min-w-0 w-full" 
                locale={locale} 
                dict={dict} 
              />
              
              {/* Debug: Add extra content to test scrolling */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2">Debug: Scroll Test</h3>
                  <div className="space-y-2">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} className="text-xs text-muted-foreground">
                        Test item {i + 1} - This content should be scrollable
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}