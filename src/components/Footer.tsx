"use client"

import { useState } from "react"
import Link from "next/link"
import { FaXTwitter, FaFacebook, FaThreads, FaBluesky } from "react-icons/fa6"
import { Trophy, ChevronDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const [openSections, setOpenSections] = useState<string[]>([])
  const [showBackToTop, setShowBackToTop] = useState(false)

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

  // Show back to top button when scrolled
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setShowBackToTop(window.scrollY > 400)
    })
  }

  return (
    <>
      <footer className="bg-slate-900 dark:bg-slate-950 text-white border-t border-slate-700 dark:border-slate-600 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 opacity-50"></div>

        
        <div className="container mx-auto px-6 py-16 relative z-10">
          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-4 gap-12 lg:gap-16">
            {/* Brand & Links */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 p-2 rounded-lg">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold">
                  <span className="text-red-500">Transfers</span>
                  <span className="text-white">Daily</span>
                </div>
              </div>
              <p className="text-sm text-slate-300 dark:text-slate-200 leading-relaxed max-w-sm">
                Your trusted source for the latest football transfer news, rumors, and analysis from around the world.
              </p>
              
              {/* Social Media Icons */}
              <div className="space-y-4">
                <h4 className="font-medium text-red-500 uppercase tracking-wider text-sm">Follow Us</h4>
                <div className="flex items-center gap-4">
                  <Link 
                    href="https://twitter.com/transfersdaily" 
                    className="bg-slate-800 hover:bg-blue-500 p-3 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                    aria-label="Follow us on Twitter"
                  >
                    <FaXTwitter className="h-5 w-5 text-white" />
                  </Link>
                  <Link 
                    href="https://www.threads.net/@transfersdaily" 
                    className="bg-slate-800 hover:bg-black p-3 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
                    aria-label="Follow us on Threads"
                  >
                    <FaThreads className="h-5 w-5 text-white" />
                  </Link>
                  <Link 
                    href="https://bsky.app/profile/transfersdaily" 
                    className="bg-slate-800 hover:bg-blue-500 p-3 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                    aria-label="Follow us on Bluesky"
                  >
                    <FaBluesky className="h-5 w-5 text-white" />
                  </Link>
                  <Link 
                    href="https://facebook.com/transfersdaily" 
                    className="bg-slate-800 hover:bg-blue-600 p-3 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-slate-900"
                    aria-label="Follow us on Facebook"
                  >
                    <FaFacebook className="h-5 w-5 text-white" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="font-medium text-red-500 uppercase tracking-wider text-sm">Quick Links</h4>
              <ul className="space-y-3 text-sm text-slate-300 dark:text-slate-200">
                <li><Link href="/latest" className="hover-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">Latest News</Link></li>
                <li><Link href="/search" className="hover-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">Search</Link></li>
                <li><Link href="/about" className="hover-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">About</Link></li>
                <li><Link href="/contact" className="hover-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">Contact Us</Link></li>
              </ul>
            </div>

            {/* Leagues */}
            <div className="space-y-6">
              <h4 className="font-medium text-red-500 uppercase tracking-wider text-sm">Leagues</h4>
              <ul className="space-y-3 text-sm text-slate-300 dark:text-slate-200">
                <li><Link href="/league/premier-league" className="hover-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">Premier League</Link></li>
                <li><Link href="/league/la-liga" className="hover-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">La Liga</Link></li>
                <li><Link href="/league/serie-a" className="hover-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">Serie A</Link></li>
                <li><Link href="/league/bundesliga" className="hover-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">Bundesliga</Link></li>
                <li><Link href="/league/ligue-1" className="hover-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">Ligue 1</Link></li>
              </ul>
            </div>

            {/* Contact & Legal */}
            <div className="space-y-6">
              <h4 className="font-medium text-red-500 uppercase tracking-wider text-sm">Contact</h4>
              <div className="space-y-3 text-sm text-slate-300 dark:text-slate-200">
                <p>Get in touch with our team</p>
                <a href="mailto:info@transfersdaily.com" className="block font-medium text-slate-300 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">
                  info@transfersdaily.com
                </a>
              </div>
              
              <div className="space-y-4 pt-4">
                <h4 className="font-medium text-red-500 uppercase tracking-wider text-sm">Legal</h4>
                <ul className="space-y-3 text-sm text-slate-300 dark:text-slate-200">
                  <li><Link href="/privacy" className="hover-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mobile Accordion Layout */}
          <div className="md:hidden space-y-6">
            {/* Brand */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="bg-red-500 p-2 rounded-lg">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold">
                  <span className="text-red-500">Transfers</span>
                  <span className="text-white">Daily</span>
                </div>
              </div>
              <p className="text-slate-300 text-sm">
                Your trusted source for football transfer news
              </p>
            </div>

            {/* Accordion Sections */}
            {[
              { 
                key: 'links', 
                title: 'Quick Links', 
                content: (
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li><Link href="/latest" className="block py-2 hover-underline">Latest News</Link></li>
                    <li><Link href="/search" className="block py-2 hover-underline">Search</Link></li>
                    <li><Link href="/about" className="block py-2 hover-underline">About</Link></li>
                    <li><Link href="/contact" className="block py-2 hover-underline">Contact Us</Link></li>
                  </ul>
                )
              },
              { 
                key: 'leagues', 
                title: 'Leagues & Transfers', 
                content: (
                  <div className="space-y-4">
                    <ul className="space-y-3 text-sm text-slate-300">
                      <li><Link href="/league/premier-league" className="block py-2 hover-underline">Premier League</Link></li>
                      <li><Link href="/league/la-liga" className="block py-2 hover-underline">La Liga</Link></li>
                      <li><Link href="/league/serie-a" className="block py-2 hover-underline">Serie A</Link></li>
                      <li><Link href="/transfers/confirmed" className="block py-2 hover-underline">Confirmed Transfers</Link></li>
                      <li><Link href="/transfers/rumors" className="block py-2 hover-underline">Rumors</Link></li>
                    </ul>
                  </div>
                )
              },
              { 
                key: 'contact', 
                title: 'Contact & Legal', 
                content: (
                  <div className="space-y-4 text-sm text-slate-300">
                    <a href="mailto:info@transfersdaily.com" className="block py-2 text-slate-300 font-medium">
                      info@transfersdaily.com
                    </a>
                    <Link href="/privacy" className="block py-2 hover-underline">Privacy Policy</Link>
                    <Link href="/terms" className="block py-2 hover-underline">Terms of Service</Link>
                  </div>
                )
              }
            ].map(section => (
              <div key={section.key} className="border-b border-slate-700 pb-4">
                <button
                  onClick={() => toggleSection(section.key)}
                  className="flex items-center justify-between w-full py-3 text-left text-white font-medium uppercase tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
                >
                  {section.title}
                  <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes(section.key) ? 'rotate-180' : ''}`} />
                </button>
                {openSections.includes(section.key) && (
                  <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
                    {section.content}
                  </div>
                )}
              </div>
            ))}

            {/* Social Media */}
            <div className="text-center space-y-4">
              <h4 className="font-medium text-red-500 uppercase tracking-wider text-sm">Follow Us</h4>
              <div className="flex items-center justify-center gap-4">
                <Link href="https://twitter.com/transfersdaily" className="bg-slate-800 hover:bg-blue-500 p-3 rounded-full transition-all duration-200 hover:scale-110">
                  <FaXTwitter className="h-5 w-5 text-white" />
                </Link>
                <Link href="https://www.threads.net/@transfersdaily" className="bg-slate-800 hover:bg-black p-3 rounded-full transition-all duration-200 hover:scale-110">
                  <FaThreads className="h-5 w-5 text-white" />
                </Link>
                <Link href="https://bsky.app/profile/transfersdaily" className="bg-slate-800 hover:bg-blue-500 p-3 rounded-full transition-all duration-200 hover:scale-110">
                  <FaBluesky className="h-5 w-5 text-white" />
                </Link>
                <Link href="https://facebook.com/transfersdaily" className="bg-slate-800 hover:bg-blue-600 p-3 rounded-full transition-all duration-200 hover:scale-110">
                  <FaFacebook className="h-5 w-5 text-white" />
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400 dark:text-slate-300">
              © 2025 TransfersDaily. All rights reserved.
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-300 mt-4 md:mt-0">
              Built with ❤️ for football fans worldwide
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          size="icon"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}

      <style jsx>{`
        .hover-underline {
          position: relative;
          transition: color 0.2s ease;
        }
        .hover-underline::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px;
          left: 50%;
          background-color: #ef4444;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .hover-underline:hover::after {
          width: 100%;
        }
        .hover-underline:hover {
          color: white;
        }
      `}</style>
    </>
  )
}