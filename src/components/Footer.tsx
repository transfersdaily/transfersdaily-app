"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FaXTwitter, FaFacebook, FaThreads, FaBluesky } from "react-icons/fa6"
import { Trophy, ChevronDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDictionary } from "@/lib/dictionary-provider"
import { useParams } from "next/navigation"
import { type Locale } from "@/lib/i18n"

export function Footer() {
  const [openSections, setOpenSections] = useState<string[]>([])
  const [showBackToTop, setShowBackToTop] = useState(false)
  const params = useParams()
  const locale = (params?.locale as Locale) || 'en'
  const { dict, t: contextT } = useDictionary()
  
  // Fallback translation function
  const t = (key: string, fallback?: string) => {
    try {
      return contextT(key) || fallback || key
    } catch {
      return fallback || key
    }
  }

  const getLocalizedPath = (path: string) => {
    return locale === 'en' ? path : `/${locale}${path}`
  }

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <footer className="bg-background border-t border-border relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted opacity-50"></div>

        <div className="container mx-auto px-4 md:px-6 py-8 md:py-16 pb-20 md:pb-8 relative z-10">
          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-4 gap-12 lg:gap-16">
            {/* Brand & Links */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-lg">
                  <Trophy className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold">
                  <span className="text-primary">Transfers</span>
                  <span className="text-foreground">Daily</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                {t('footer.description', 'Your trusted source for the latest football transfer news, rumors, and analysis from around the world.')}
              </p>
              
              {/* Social Media Icons */}
              <div className="space-y-4">
                <h4 className="font-medium text-primary uppercase tracking-wider text-sm">{t('footer.followUs', 'Follow Us')}</h4>
                <div className="flex items-center gap-4">
                  <Link 
                    href="https://twitter.com/transfersdaily" 
                    className="bg-muted hover:bg-blue-500 p-3 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background"
                    aria-label="Follow us on Twitter"
                  >
                    <FaXTwitter className="h-5 w-5 text-muted-foreground hover:text-white" />
                  </Link>
                  <Link 
                    href="https://www.threads.net/@transfersdaily" 
                    className="bg-muted hover:bg-black p-3 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-background"
                    aria-label="Follow us on Threads"
                  >
                    <FaThreads className="h-5 w-5 text-muted-foreground hover:text-white" />
                  </Link>
                  <Link 
                    href="https://bsky.app/profile/transfersdaily" 
                    className="bg-muted hover:bg-blue-500 p-3 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background"
                    aria-label="Follow us on Bluesky"
                  >
                    <FaBluesky className="h-5 w-5 text-muted-foreground hover:text-white" />
                  </Link>
                  <Link 
                    href="https://facebook.com/transfersdaily" 
                    className="bg-muted hover:bg-blue-600 p-3 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-background"
                    aria-label="Follow us on Facebook"
                  >
                    <FaFacebook className="h-5 w-5 text-muted-foreground hover:text-white" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="font-medium text-primary uppercase tracking-wider text-sm">{t('footer.quickLinks', 'Quick Links')}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href={getLocalizedPath("/latest")} className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">{t('navigation.latest', 'Latest News')}</Link></li>
                <li><Link href={getLocalizedPath("/search")} className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">{t('common.search', 'Search')}</Link></li>
                <li><Link href={getLocalizedPath("/about")} className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">{t('navigation.about', 'About')}</Link></li>
                <li><Link href={getLocalizedPath("/contact")} className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">{t('navigation.contact', 'Contact Us')}</Link></li>
              </ul>
            </div>

            {/* Leagues */}
            <div className="space-y-6">
              <h4 className="font-medium text-primary uppercase tracking-wider text-sm">{t('footer.leagues', 'Leagues')}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href={getLocalizedPath("/league/premier-league")} className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">Premier League</Link></li>
                <li><Link href={getLocalizedPath("/league/la-liga")} className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">La Liga</Link></li>
                <li><Link href={getLocalizedPath("/league/serie-a")} className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">Serie A</Link></li>
                <li><Link href={getLocalizedPath("/league/bundesliga")} className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">Bundesliga</Link></li>
                <li><Link href={getLocalizedPath("/league/ligue-1")} className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">Ligue 1</Link></li>
              </ul>
            </div>

            {/* Contact & Legal */}
            <div className="space-y-6">
              <h4 className="font-medium text-primary uppercase tracking-wider text-sm">Contact</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Get in touch with our team</p>
                <a href="mailto:info@transfersdaily.com" className="block font-medium hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">
                  info@transfersdaily.com
                </a>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="font-medium text-primary uppercase tracking-wider text-sm">Legal</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="/privacy" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-4 md:space-y-8">
            {/* Brand */}
            <div className="text-center space-y-2 md:space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="bg-primary p-2 rounded-lg hidden md:block">
                  <Trophy className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="text-xl md:text-2xl font-bold">
                  <span className="text-primary">Transfers</span>
                  <span className="text-foreground">Daily</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Your trusted source for football transfer news
              </p>
            </div>

            {/* Social Media - Mobile */}
            <div className="text-center space-y-2 md:space-y-4">
              <h4 className="font-medium text-primary uppercase tracking-wider text-sm">Follow Us</h4>
              <div className="flex items-center justify-center gap-4">
                <Link href="https://twitter.com/transfersdaily" className="bg-muted hover:bg-blue-500 p-3 rounded-full transition-all duration-200 hover:scale-110">
                  <FaXTwitter className="h-5 w-5 text-muted-foreground hover:text-white" />
                </Link>
                <Link href="https://www.threads.net/@transfersdaily" className="bg-muted hover:bg-black p-3 rounded-full transition-all duration-200 hover:scale-110">
                  <FaThreads className="h-5 w-5 text-muted-foreground hover:text-white" />
                </Link>
                <Link href="https://bsky.app/profile/transfersdaily" className="bg-muted hover:bg-blue-500 p-3 rounded-full transition-all duration-200 hover:scale-110">
                  <FaBluesky className="h-5 w-5 text-muted-foreground hover:text-white" />
                </Link>
                <Link href="https://facebook.com/transfersdaily" className="bg-muted hover:bg-blue-600 p-3 rounded-full transition-all duration-200 hover:scale-110">
                  <FaFacebook className="h-5 w-5 text-muted-foreground hover:text-white" />
                </Link>
              </div>
            </div>

            {/* Collapsible Sections */}
            {[
              {
                key: 'links',
                title: 'Quick Links', 
                content: (
                  <ul className="space-y-1 md:space-y-3 text-sm text-muted-foreground">
                    <li><Link href="/latest" className="block py-1 md:py-2 hover:text-foreground transition-colors">Latest News</Link></li>
                    <li><Link href="/search" className="block py-1 md:py-2 hover:text-foreground transition-colors">Search</Link></li>
                    <li><Link href="/about" className="block py-1 md:py-2 hover:text-foreground transition-colors">About</Link></li>
                    <li><Link href="/contact" className="block py-1 md:py-2 hover:text-foreground transition-colors">Contact</Link></li>
                  </ul>
                )
              },
              {
                key: 'leagues',
                title: 'Leagues',
                content: (
                  <div className="space-y-2 md:space-y-4">
                    <ul className="space-y-1 md:space-y-3 text-sm text-muted-foreground">
                      <li><Link href="/league/premier-league" className="block py-1 md:py-2 hover:text-foreground transition-colors">Premier League</Link></li>
                      <li><Link href="/league/la-liga" className="block py-1 md:py-2 hover:text-foreground transition-colors">La Liga</Link></li>
                      <li><Link href="/league/serie-a" className="block py-1 md:py-2 hover:text-foreground transition-colors">Serie A</Link></li>
                      <li><Link href="/league/bundesliga" className="block py-1 md:py-2 hover:text-foreground transition-colors">Bundesliga</Link></li>
                      <li><Link href="/league/ligue-1" className="block py-1 md:py-2 hover:text-foreground transition-colors">Ligue 1</Link></li>
                    </ul>
                  </div>
                )
              },
              {
                key: 'contact',
                title: 'Contact & Legal', 
                content: (
                  <div className="space-y-2 md:space-y-4 text-sm text-muted-foreground">
                    <a href="mailto:info@transfersdaily.com" className="block py-1 md:py-2 font-medium hover:text-foreground transition-colors">
                      info@transfersdaily.com
                    </a>
                    <Link href="/privacy" className="block py-1 md:py-2 hover:text-foreground transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="block py-1 md:py-2 hover:text-foreground transition-colors">Terms of Service</Link>
                  </div>
                )
              }
            ].map(section => (
              <div key={section.key} className="border-b border-border pb-2 md:pb-4">
                <button
                  onClick={() => toggleSection(section.key)}
                  className="flex items-center justify-between w-full py-2 md:py-3 text-left text-foreground font-medium uppercase tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
                >
                  {section.title}
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform ${
                      openSections.includes(section.key) ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {openSections.includes(section.key) && (
                  <div className="mt-2 md:mt-4">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          size="icon"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
    </>
  )
}
