import { Metadata } from 'next'
import { type Locale, getDictionary, locales } from "@/lib/i18n"
import { ContactPageClient } from './ContactPageClient'

interface ContactPageProps {
  params: Promise<{ locale: Locale }>
}

// Generate comprehensive metadata for contact page
export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params
  
  // Dynamic metadata based on language
  const metaData = {
    en: {
      title: 'Contact Us - Transfer Daily | Get in Touch',
      description: 'Contact Transfer Daily for questions, feedback, or collaboration opportunities. We respond within 24 hours to all inquiries about football transfer news.',
      keywords: 'contact transfer daily, football news contact, soccer news feedback, transfer news inquiry, sports journalism contact'
    },
    es: {
      title: 'Contáctanos - Transfer Daily | Ponte en Contacto',
      description: 'Contacta con Transfer Daily para preguntas, comentarios u oportunidades de colaboración. Respondemos en 24 horas a todas las consultas sobre noticias de fichajes.',
      keywords: 'contactar transfer daily, contacto noticias fútbol, comentarios noticias soccer, consulta noticias fichajes, contacto periodismo deportivo'
    },
    fr: {
      title: 'Nous Contacter - Transfer Daily | Entrer en Contact',
      description: 'Contactez Transfer Daily pour des questions, commentaires ou opportunités de collaboration. Nous répondons sous 24h à toutes les demandes sur les transferts.',
      keywords: 'contacter transfer daily, contact actualités football, commentaires nouvelles soccer, demande nouvelles transferts, contact journalisme sportif'
    },
    it: {
      title: 'Contattaci - Transfer Daily | Mettiti in Contatto',
      description: 'Contatta Transfer Daily per domande, feedback o opportunità di collaborazione. Rispondiamo entro 24 ore a tutte le richieste sui trasferimenti calcistici.',
      keywords: 'contattare transfer daily, contatto notizie calcio, feedback notizie soccer, richiesta notizie trasferimenti, contatto giornalismo sportivo'
    },
    de: {
      title: 'Kontakt - Transfer Daily | Kontakt Aufnehmen',
      description: 'Kontaktieren Sie Transfer Daily für Fragen, Feedback oder Kooperationsmöglichkeiten. Wir antworten innerhalb von 24 Stunden auf alle Transfer-Anfragen.',
      keywords: 'transfer daily kontakt, fußball nachrichten kontakt, soccer news feedback, transfer nachrichten anfrage, sport journalismus kontakt'
    }
  }

  const currentMeta = metaData[locale] || metaData.en

  return {
    title: currentMeta.title,
    description: currentMeta.description,
    keywords: currentMeta.keywords,
    authors: [{ name: 'Transfer Daily', url: 'https://transferdaily.com' }],
    creator: 'Transfer Daily',
    publisher: 'Transfer Daily',
    
    // Robots and indexing
    robots: { 
      index: true, 
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    },
    
    // Canonical URL and language alternates
    alternates: {
      canonical: `/${locale}/contact`,
      languages: Object.fromEntries(
        locales.map(lang => [lang, `/${lang}/contact`])
      ),
    },
    
    // Enhanced meta tags for contact page
    other: {
      'contact:email': 'contact@transfersdaily.com',
      'contact:response_time': '24 hours',
      'page:type': 'contact',
      'business:hours': 'Monday-Friday: 24h response, Weekends: 48h response',
      'geo.region': locale === 'en' ? 'GB' : locale === 'es' ? 'ES' : locale === 'it' ? 'IT' : locale === 'fr' ? 'FR' : 'DE',
      'category': 'Contact',
      'content:type': 'contact-form'
    },
    
    // Open Graph metadata
    openGraph: {
      title: currentMeta.title,
      description: currentMeta.description,
      url: `https://transferdaily.com/${locale}/contact`,
      siteName: 'Transfer Daily',
      locale: locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : locale === 'it' ? 'it_IT' : locale === 'fr' ? 'fr_FR' : 'de_DE',
      type: 'website',
      images: [
        {
          url: '/og-contact.jpg',
          width: 1200,
          height: 630,
          alt: `${currentMeta.title} - Transfer Daily Contact`,
          type: 'image/jpeg',
        }
      ],
    },
    
    // Twitter metadata
    twitter: {
      card: 'summary_large_image',
      site: '@transferdaily',
      creator: '@transferdaily',
      title: currentMeta.title,
      description: currentMeta.description,
      images: ['/og-contact.jpg'],
    },
    
    // Additional metadata
    category: 'Contact',
    classification: 'Contact Page',
  }
}

// Server-side rendered contact page
export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params
  
  // Validate locale
  if (!locales.includes(locale)) {
    return <div>Invalid locale</div>
  }
  
  // Get translations server-side
  const dict = await getDictionary(locale)
  
  // Generate structured data for contact page
  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Transfer Daily",
    "description": "Contact page for Transfer Daily - Football transfer news and updates",
    "url": `https://transferdaily.com/${locale}/contact`,
    "mainEntity": {
      "@type": "Organization",
      "name": "Transfer Daily",
      "url": "https://transferdaily.com",
      "logo": "https://transferdaily.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+44-XXX-XXX-XXXX",
        "contactType": "customer service",
        "email": "contact@transfersdaily.com",
        "availableLanguage": ["English", "Spanish", "French", "Italian", "German"],
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "17:00"
        }
      },
      "sameAs": [
        "https://twitter.com/transferdaily",
        "https://facebook.com/transferdaily",
        "https://instagram.com/transferdaily"
      ]
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `https://transferdaily.com/${locale}`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Contact",
          "item": `https://transferdaily.com/${locale}/contact`
        }
      ]
    },
    "inLanguage": locale,
    "isAccessibleForFree": true
  }

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How often is content updated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We update our transfer news multiple times daily during transfer windows and regularly throughout the season."
        }
      },
      {
        "@type": "Question", 
        "name": "Can I submit transfer tips?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Use the contact form to share reliable transfer information with our editorial team."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer advertising opportunities?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer various advertising and partnership opportunities. Contact us for more information."
        }
      }
    ]
  }

  return (
    <main className="min-h-screen bg-background">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactStructuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData)
        }}
      />
      
      {/* Client-side interactive component */}
      <ContactPageClient locale={locale} dict={dict} />
    </main>
  )
}
