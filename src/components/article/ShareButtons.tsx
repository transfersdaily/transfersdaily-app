'use client'

import { useState } from 'react'
import { Link, Twitter, MessageCircle, Check } from 'lucide-react'
import { type Dictionary, getTranslation } from '@/lib/i18n'

interface ShareButtonsProps {
  url: string
  title: string
  dict?: Dictionary
}

export function ShareButtons({ url, title, dict }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const t = (key: string, fallback: string) => {
    if (dict) {
      const val = getTranslation(dict, key)
      if (val && val !== key) return val
    }
    return fallback
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShareTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    window.open(tweetUrl, '_blank', 'noopener')
  }

  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    window.open(whatsappUrl, '_blank', 'noopener')
  }

  const buttonClasses =
    'inline-flex items-center justify-center w-11 h-11 rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors'

  return (
    <div className="flex items-center gap-2 mt-3">
      <button
        type="button"
        onClick={handleCopyLink}
        className={buttonClasses}
        aria-label={copied ? t('article.copied', 'Copied!') : t('article.copyLink', 'Copy link')}
      >
        {copied ? <Check className="h-5 w-5" /> : <Link className="h-5 w-5" />}
      </button>

      <button
        type="button"
        onClick={handleShareTwitter}
        className={buttonClasses}
        aria-label={t('article.shareOnX', 'Share on X')}
      >
        <Twitter className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={handleShareWhatsApp}
        className={buttonClasses}
        aria-label={t('article.shareOnWhatsApp', 'Share on WhatsApp')}
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    </div>
  )
}
