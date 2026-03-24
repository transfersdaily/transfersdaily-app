'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface AboutFAQProps {
  dict: Record<string, unknown>
}

function t(dict: Record<string, unknown>, key: string, fallback: string): string {
  const keys = key.split('.')
  let result: unknown = dict
  for (const k of keys) {
    if (result && typeof result === 'object' && result !== null && k in result) {
      result = (result as Record<string, unknown>)[k]
    } else {
      return fallback
    }
  }
  return typeof result === 'string' ? result : fallback
}

const faqs = [
  { key: 'q1', q: 'How often is content updated?', a: 'We update our transfer news multiple times daily during transfer windows and regularly throughout the season. Our team works around the clock to bring you the latest confirmed transfers, breaking rumors, and exclusive insights.' },
  { key: 'q2', q: 'How do you verify transfer information?', a: 'We use multiple reliable sources including official club announcements, trusted journalists, and verified social media accounts. All information is cross-referenced before publication. We clearly distinguish between confirmed transfers and rumors.' },
  { key: 'q3', q: 'Can I submit transfer tips?', a: 'Yes! We welcome reliable transfer information from our community. Use our contact page to share tips with our editorial team. Please include as much detail as possible, including sources when available.' },
  { key: 'q4', q: 'Do you offer advertising opportunities?', a: 'We offer various advertising and partnership opportunities including banner ads, sponsored content, and newsletter placements. Contact us for detailed media kit and pricing information.' },
  { key: 'q5', q: 'Can I republish your content?', a: 'Our content is protected by copyright. For republishing requests, syndication opportunities, or content licensing, please contact us with details about your intended use.' },
  { key: 'q6', q: 'How can I report incorrect information?', a: 'We take accuracy seriously. If you notice incorrect information in any of our articles, please contact us immediately. Include the article URL and details about the correction needed.' },
  { key: 'q7', q: 'Do you have a mobile app?', a: 'Our website is fully responsive and optimized for mobile browsers. We are considering a dedicated mobile app for the future — stay tuned for updates!' },
  { key: 'q8', q: 'Can I get notifications for specific clubs?', a: 'While we don\'t currently offer personalized notifications, you can follow specific leagues and clubs through our organized sections. We are working on implementing notification features.' },
]

export function AboutFAQ({ dict }: AboutFAQProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {faqs.map((faq, i) => (
        <AccordionItem key={faq.key} value={`item-${i}`} className="border border-border/50 rounded-lg bg-card/50">
          <AccordionTrigger className="text-left px-6 py-5 hover:no-underline">
            <span className="font-sans text-sm md:text-base font-medium text-foreground">
              {t(dict, `contact.faq.${faq.key}`, faq.q)}
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-5">
            <p className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
              {t(dict, `contact.faq.a${i + 1}`, faq.a)}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
