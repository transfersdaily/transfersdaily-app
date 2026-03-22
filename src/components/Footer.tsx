"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FaXTwitter, FaFacebook, FaThreads, FaBluesky } from "react-icons/fa6"
import { ChevronDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDictionary } from "@/lib/dictionary-provider"
import { useParams } from "next/navigation"
import { type Locale } from "@/lib/i18n"
import { typography } from "@/lib/typography"
import { cn, motion } from "@/lib/theme"

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
              <div className={typography.logo.navbar}>
                <span className="text-primary">Transfers</span>
                <span className="text-foreground">Daily</span>
              </div>
              <p className={cn(typography.body.small, 'text-muted-foreground leading-relaxed max-w-sm')}>
                {t('footer.description', 'Your trusted source for the latest football transfer news, rumors, and analysis from around the world.')}
              </p>

              {/* Social Media Icons */}
              <div className="space-y-4">
                <h4 className="font-display text-sm font-bold text-primary uppercase tracking-wide">{t('footer.followUs', 'Follow Us')}</h4>
                <div className="flex items-center gap-4">
                  <Link
                    href="https://twitter.com/transfersdaily"
                    className="bg-muted hover:bg-primary p-3 rounded-full cursor-pointer motion-safe:transition-colors duration-fast motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    aria-label="Follow us on Twitter"
                  >
                    <FaXTwitter className="h-5 w-5 text-muted-foreground" />
                  </Link>
                  <Link
                    href="https://www.threads.net/@transfersdaily"
                    className="bg-muted hover:bg-primary p-3 rounded-full cursor-pointer motion-safe:transition-colors duration-fast motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    aria-label="Follow us on Threads"
                  >
                    <FaThreads className="h-5 w-5 text-muted-foreground" />
                  </Link>
                  <Link
                    href="https://bsky.app/profile/transfersdaily"
                    className="bg-muted hover:bg-primary p-3 rounded-full cursor-pointer motion-safe:transition-colors duration-fast motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    aria-label="Follow us on Bluesky"
                  >
                    <FaBluesky className="h-5 w-5 text-muted-foreground" />
                  </Link>
                  <Link
                    href="https://facebook.com/transfersdaily"
                    className="bg-muted hover:bg-primary p-3 rounded-full cursor-pointer motion-safe:transition-colors duration-fast motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    aria-label="Follow us on Facebook"
                  >
                    <FaFacebook className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="font-display text-sm font-bold text-primary uppercase tracking-wide">{t('footer.quickLinks', 'Quick Links')}</h4>
              <ul className={cn(typography.body.small, 'space-y-1 text-muted-foreground')}>
                <li><Link href={getLocalizedPath("/latest")} className="min-h-[48px] inline-flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">{t('navigation.latest', 'Latest News')}</Link></li>
                <li><Link href={getLocalizedPath("/search")} className="min-h-[48px] inline-flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">{t('common.search', 'Search')}</Link></li>
                <li><Link href={getLocalizedPath("/about")} className="min-h-[48px] inline-flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">{t('navigation.about', 'About')}</Link></li>
                <li><Link href={getLocalizedPath("/contact")} className="min-h-[48px] inline-flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">{t('navigation.contact', 'Contact Us')}</Link></li>
              </ul>
            </div>

            {/* Leagues */}
            <div className="space-y-6">
              <h4 className="font-display text-sm font-bold text-primary uppercase tracking-wide">{t('footer.leagues', 'Leagues')}</h4>
              <ul className={cn(typography.body.small, 'space-y-1 text-muted-foreground')}>
                <li><Link href={getLocalizedPath("/league/premier-league")} className="min-h-[48px] inline-flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">Premier League</Link></li>
                <li><Link href={getLocalizedPath("/league/la-liga")} className="min-h-[48px] inline-flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">La Liga</Link></li>
                <li><Link href={getLocalizedPath("/league/serie-a")} className="min-h-[48px] inline-flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">Serie A</Link></li>
                <li><Link href={getLocalizedPath("/league/bundesliga")} className="min-h-[48px] inline-flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">Bundesliga</Link></li>
                <li><Link href={getLocalizedPath("/league/ligue-1")} className="min-h-[48px] inline-flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">Ligue 1</Link></li>
              </ul>
            </div>

            {/* Contact & Legal */}
            <div className="space-y-6">
              <h4 className="font-display text-sm font-bold text-primary uppercase tracking-wide">Contact</h4>
              <div className={cn(typography.body.small, 'space-y-3 text-muted-foreground')}>
                <p>Get in touch with our team</p>
                <a href="mailto:info@transfersdaily.com" className="block font-medium min-h-[48px] inline-flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">
                  info@transfersdaily.com
                </a>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="font-display text-sm font-bold text-primary uppercase tracking-wide">Legal</h4>
                <ul className={cn(typography.body.small, 'space-y-1 text-muted-foreground')}>
                  <li><Link href={getLocalizedPath("/privacy")} className="min-h-[48px] inline-flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">Privacy Policy</Link></li>
                  <li><Link href={getLocalizedPath("/terms")} className="min-h-[48px] inline-flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-4 md:space-y-8">
            {/* Brand */}
            <div className="text-center space-y-2 md:space-y-4">
              <div className={typography.logo.navbar}>
                <span className="text-primary">Transfers</span>
                <span className="text-foreground">Daily</span>
              </div>
              <p className={cn(typography.body.small, 'text-muted-foreground')}>
                Your trusted source for football transfer news
              </p>
            </div>

            {/* Social Media - Mobile */}
            <div className="text-center space-y-2 md:space-y-4">
              <h4 className="font-display text-sm font-bold text-primary uppercase tracking-wide">Follow Us</h4>
              <div className="flex items-center justify-center gap-4">
                <Link href="https://twitter.com/transfersdaily" className="bg-muted hover:bg-primary p-3 rounded-full cursor-pointer motion-safe:transition-colors duration-fast motion-reduce:transition-none">
                  <FaXTwitter className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link href="https://www.threads.net/@transfersdaily" className="bg-muted hover:bg-primary p-3 rounded-full cursor-pointer motion-safe:transition-colors duration-fast motion-reduce:transition-none">
                  <FaThreads className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link href="https://bsky.app/profile/transfersdaily" className="bg-muted hover:bg-primary p-3 rounded-full cursor-pointer motion-safe:transition-colors duration-fast motion-reduce:transition-none">
                  <FaBluesky className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link href="https://facebook.com/transfersdaily" className="bg-muted hover:bg-primary p-3 rounded-full cursor-pointer motion-safe:transition-colors duration-fast motion-reduce:transition-none">
                  <FaFacebook className="h-5 w-5 text-muted-foreground" />
                </Link>
              </div>
            </div>

            {/* Collapsible Sections */}
            {[
              {
                key: 'links',
                title: 'Quick Links',
                content: (
                  <ul className={cn(typography.body.small, 'space-y-1 md:space-y-3 text-muted-foreground')}>
                    <li><Link href={getLocalizedPath("/latest")} className="block py-1 md:py-2 min-h-[48px] flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none">Latest News</Link></li>
                    <li><Link href={getLocalizedPath("/search")} className="block py-1 md:py-2 min-h-[48px] flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none">Search</Link></li>
                    <li><Link href={getLocalizedPath("/about")} className="block py-1 md:py-2 min-h-[48px] flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none">About</Link></li>
                    <li><Link href={getLocalizedPath("/contact")} className="block py-1 md:py-2 min-h-[48px] flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none">Contact</Link></li>
                  </ul>
                )
              },
              {
                key: 'leagues',
                title: 'Leagues',
                content: (
                  <div className="space-y-2 md:space-y-4">
                    <ul className={cn(typography.body.small, 'space-y-1 md:space-y-3 text-muted-foreground')}>
                      <li><Link href={getLocalizedPath("/league/premier-league")} className="block py-1 md:py-2 min-h-[48px] flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none">Premier League</Link></li>
                      <li><Link href={getLocalizedPath("/league/la-liga")} className="block py-1 md:py-2 min-h-[48px] flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none">La Liga</Link></li>
                      <li><Link href={getLocalizedPath("/league/serie-a")} className="block py-1 md:py-2 min-h-[48px] flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none">Serie A</Link></li>
                      <li><Link href={getLocalizedPath("/league/bundesliga")} className="block py-1 md:py-2 min-h-[48px] flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none">Bundesliga</Link></li>
                      <li><Link href={getLocalizedPath("/league/ligue-1")} className="block py-1 md:py-2 min-h-[48px] flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none">Ligue 1</Link></li>
                    </ul>
                  </div>
                )
              },
              {
                key: 'contact',
                title: 'Contact & Legal',
                content: (
                  <div className={cn(typography.body.small, 'space-y-2 md:space-y-4 text-muted-foreground')}>
                    <a href="mailto:info@transfersdaily.com" className="block py-1 md:py-2 min-h-[48px] flex items-center cursor-pointer font-medium hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none">
                      info@transfersdaily.com
                    </a>
                    <Link href={getLocalizedPath("/privacy")} className="block py-1 md:py-2 min-h-[48px] flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none">Privacy Policy</Link>
                    <Link href={getLocalizedPath("/terms")} className="block py-1 md:py-2 min-h-[48px] flex items-center cursor-pointer hover:text-foreground motion-safe:transition-colors duration-fast motion-reduce:transition-none">Terms of Service</Link>
                  </div>
                )
              }
            ].map(section => (
              <div key={section.key} className="border-b border-border pb-2 md:pb-4">
                <button
                  onClick={() => toggleSection(section.key)}
                  className={cn(
                    'font-sans text-sm font-semibold leading-normal',
                    'flex items-center justify-between w-full py-2 md:py-3 text-left text-foreground cursor-pointer uppercase tracking-wider',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded'
                  )}
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
          className="fixed bottom-20 md:bottom-6 right-6 z-20 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full shadow-lg cursor-pointer motion-safe:transition-colors duration-fast motion-reduce:transition-none"
          size="icon"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
    </>
  )
}
