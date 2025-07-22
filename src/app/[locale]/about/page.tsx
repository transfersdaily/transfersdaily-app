"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Target, Zap, Award } from "lucide-react"
import { Sidebar } from "@/components/Sidebar"
import { type Locale, getDictionary, getTranslation } from "@/lib/i18n"

export default function AboutPage() {
  const params = useParams()
  const locale = params.locale as Locale
  
  const [dict, setDict] = useState<any>({})
  const [translationsLoaded, setTranslationsLoaded] = useState(false)

  useEffect(() => {
    loadDictionary()
  }, [locale])

  const loadDictionary = async () => {
    try {
      setTranslationsLoaded(false)
      const dictionary = await getDictionary(locale)
      setDict(dictionary)
      setTranslationsLoaded(true)
    } catch (error) {
      console.error('Error loading dictionary:', error)
      setTranslationsLoaded(true)
    }
  }

  const t = (key: string) => {
    if (!translationsLoaded) return ''
    return getTranslation(dict, key)
  }

  if (!translationsLoaded) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
            <div className="lg:col-span-7">
              <div className="py-8">
                <div className="h-8 w-64 bg-muted rounded animate-pulse mb-6"></div>
                <div className="h-4 w-full bg-muted rounded animate-pulse mb-4"></div>
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse mb-4"></div>
              </div>
            </div>
            <div className="hidden lg:block lg:col-span-3">
              <div className="bg-muted/10 border-l -mr-4 pr-4">
                <div className="p-4">
                  <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-4 w-full bg-muted rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
          <div className="lg:col-span-7">
            {/* Story Section */}
            <section className="py-16 bg-gradient-to-r from-muted/30 to-muted/10 -mx-4 px-4 rounded-3xl">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">{t('about.ourStory')}</h2>
                  <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
                </div>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">The Problem</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('about.storyParagraph1')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">The Solution</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('about.storyParagraph2')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Today</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('about.storyParagraph3')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <Sidebar locale={locale} dict={dict} />
          </div>
        </div>
      </div>

    </main>
  )
}
