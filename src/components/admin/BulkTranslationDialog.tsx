"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, Languages, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BulkTranslationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedArticleIds: string[]
  onSuccess: (summary: any) => void
  onError: (error: string) => void
}

const AVAILABLE_LANGUAGES = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
]

export function BulkTranslationDialog({
  open,
  onOpenChange,
  selectedArticleIds,
  onSuccess,
  onError
}: BulkTranslationDialogProps) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['es', 'fr', 'de', 'it'])
  const [isLoading, setIsLoading] = useState(false)

  const handleLanguageToggle = (languageCode: string) => {
    setSelectedLanguages(prev => 
      prev.includes(languageCode)
        ? prev.filter(code => code !== languageCode)
        : [...prev, languageCode]
    )
  }

  const handleSelectAllLanguages = () => {
    if (selectedLanguages.length === AVAILABLE_LANGUAGES.length) {
      setSelectedLanguages([])
    } else {
      setSelectedLanguages(AVAILABLE_LANGUAGES.map(lang => lang.code))
    }
  }

  const handleStartTranslation = async () => {
    if (selectedLanguages.length === 0) {
      onError("Please select at least one language")
      return
    }

    setIsLoading(true)

    try {
      console.log('🚀 Starting bulk translation for:', {
        articleIds: selectedArticleIds,
        targetLanguages: selectedLanguages
      })

      const response = await fetch('/api/bulk-translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('transfersdaily_id_token')}`
        },
        body: JSON.stringify({
          articleIds: selectedArticleIds,
          targetLanguages: selectedLanguages
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start bulk translation')
      }

      console.log('✅ Bulk translation started successfully:', data)
      onSuccess(data.summary)
    } catch (error) {
      console.error('❌ Bulk translation failed:', error)
      onError(error instanceof Error ? error.message : 'Failed to start bulk translation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Generate Translations
          </DialogTitle>
          <DialogDescription>
            Generate translations for {selectedArticleIds.length} selected article{selectedArticleIds.length !== 1 ? 's' : ''} in the languages below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Article Count */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">Selected Articles</span>
            <Badge variant="secondary">{selectedArticleIds.length}</Badge>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Target Languages</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAllLanguages}
                className="h-auto p-1 text-xs"
              >
                {selectedLanguages.length === AVAILABLE_LANGUAGES.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_LANGUAGES.map((language) => (
                <div key={language.code} className="flex items-center space-x-2">
                  <Checkbox
                    id={language.code}
                    checked={selectedLanguages.includes(language.code)}
                    onCheckedChange={() => handleLanguageToggle(language.code)}
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor={language.code}
                    className="text-sm font-normal cursor-pointer flex items-center gap-2"
                  >
                    <span>{language.flag}</span>
                    {language.name}
                  </Label>
                </div>
              ))}
            </div>

            {selectedLanguages.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>

          {/* Estimation */}
          {selectedLanguages.length > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-sm">
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  Translation Summary
                </div>
                <div className="text-blue-700 dark:text-blue-300 mt-1">
                  • {selectedArticleIds.length} article{selectedArticleIds.length !== 1 ? 's' : ''}
                </div>
                <div className="text-blue-700 dark:text-blue-300">
                  • {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''}
                </div>
                <div className="text-blue-700 dark:text-blue-300">
                  • {selectedArticleIds.length * selectedLanguages.length} total translation{selectedArticleIds.length * selectedLanguages.length !== 1 ? 's' : ''}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  ⏱️ Estimated time: {Math.ceil((selectedArticleIds.length * selectedLanguages.length) / 2)} minutes
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStartTranslation}
            disabled={isLoading || selectedLanguages.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Languages className="mr-2 h-4 w-4" />
                Start Translation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
