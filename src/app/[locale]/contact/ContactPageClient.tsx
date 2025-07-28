"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Mail, MessageSquare, Clock, CheckCircle, Loader2 } from "lucide-react"
import { contactApi } from "@/lib/api"
import { trackContactSubmission } from "@/lib/analytics"
import { type Locale } from "@/lib/i18n"

interface ContactPageClientProps {
  locale: Locale
  dict: Record<string, unknown>
}

// Helper function to get translation
function getTranslation(dict: Record<string, unknown>, key: string, fallback: string): string {
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

export function ContactPageClient({ dict }: ContactPageClientProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.firstName || !formData.email || !formData.message) {
      setErrorMessage(getTranslation(dict, 'contact.validation.required', 'Please fill in all required fields'))
      setSubmitStatus('error')
      return
    }

    if (!formData.email.includes('@')) {
      setErrorMessage(getTranslation(dict, 'contact.validation.email', 'Please enter a valid email address'))
      setSubmitStatus('error')
      return
    }

    if (formData.message.length < 10) {
      setErrorMessage(getTranslation(dict, 'contact.validation.message', 'Message must be at least 10 characters long'))
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const result = await contactApi.submit({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        subject: formData.subject || getTranslation(dict, 'contact.form.generalInquiry', 'General Inquiry'),
        message: formData.message
      })

      if (result.success) {
        setSubmitStatus('success')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: ''
        })
        // Track successful contact form submission
        trackContactSubmission(formData.subject || 'General Inquiry')
      } else {
        setSubmitStatus('error')
        setErrorMessage(getTranslation(dict, 'contact.error.failed', 'Failed to send message. Please try again.'))
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setSubmitStatus('error')
      setErrorMessage(getTranslation(dict, 'contact.error.failed', 'Failed to send message. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-12">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {getTranslation(dict, 'contact.title', 'Get in Touch')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {getTranslation(dict, 'contact.subtitle', "Have a question, suggestion, or want to collaborate? We'd love to hear from you.")}
        </p>
      </header>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <section aria-labelledby="contact-form-heading">
            <h2 id="contact-form-heading" className="text-2xl font-bold mb-6">
              {getTranslation(dict, 'contact.form.title', 'Send us a Message')}
            </h2>
            <Card>
              <CardContent className="p-6">
                {submitStatus === 'success' ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-600 mb-2">
                      {getTranslation(dict, 'contact.success.title', 'Message Sent Successfully!')}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {getTranslation(dict, 'contact.success.message', "Thank you for contacting us. We'll get back to you within 24 hours.")}
                    </p>
                    <Button 
                      onClick={() => setSubmitStatus('idle')}
                      variant="outline"
                    >
                      {getTranslation(dict, 'contact.success.sendAnother', 'Send Another Message')}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block font-semibold mb-2">
                          {getTranslation(dict, 'contact.form.firstName', 'First Name')} *
                        </label>
                        <Input 
                          id="firstName" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder={getTranslation(dict, 'contact.form.firstNamePlaceholder', 'Enter your first name')}
                          required
                          disabled={isSubmitting}
                          className="border-border focus:border-primary focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block font-semibold mb-2">
                          {getTranslation(dict, 'contact.form.lastName', 'Last Name')}
                        </label>
                        <Input 
                          id="lastName" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder={getTranslation(dict, 'contact.form.lastNamePlaceholder', 'Enter your last name')}
                          disabled={isSubmitting}
                          className="border-border focus:border-primary focus:ring-primary"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block font-semibold mb-2">
                        {getTranslation(dict, 'contact.form.email', 'Email Address')} *
                      </label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={getTranslation(dict, 'contact.form.emailPlaceholder', 'Enter your email address')}
                        required
                        disabled={isSubmitting}
                        className="border-border focus:border-primary focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block font-semibold mb-2">
                        {getTranslation(dict, 'contact.form.subject', 'Subject')}
                      </label>
                      <Input 
                        id="subject" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder={getTranslation(dict, 'contact.form.subjectPlaceholder', "What's this about?")}
                        disabled={isSubmitting}
                        className="border-border focus:border-primary focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block font-semibold mb-2">
                        {getTranslation(dict, 'contact.form.message', 'Message')} *
                      </label>
                      <Textarea 
                        id="message" 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder={getTranslation(dict, 'contact.form.messagePlaceholder', 'Tell us more about your inquiry...')}
                        rows={6}
                        required
                        disabled={isSubmitting}
                        className="border-border focus:border-primary focus:ring-primary resize-none"
                      />
                    </div>

                    {submitStatus === 'error' && (
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-destructive font-medium">{errorMessage}</p>
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {getTranslation(dict, 'contact.form.sending', 'Sending Message...')}
                        </>
                      ) : (
                        getTranslation(dict, 'contact.form.send', 'Send Message')
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Contact Information */}
          <section aria-labelledby="contact-info-heading">
            <h2 id="contact-info-heading" className="text-2xl font-bold mb-6">
              {getTranslation(dict, 'contact.info.title', 'Contact Information')}
            </h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">
                        {getTranslation(dict, 'contact.info.email', 'Email')}
                      </h3>
                      <p className="text-muted-foreground">contact@transfersdaily.com</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getTranslation(dict, 'contact.info.responseTime', 'We typically respond within 24 hours')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <MessageSquare className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">
                        {getTranslation(dict, 'contact.info.inquiries', 'General Inquiries')}
                      </h3>
                      <p className="text-muted-foreground">
                        {getTranslation(dict, 'contact.info.inquiriesDesc', 'Questions about our content, partnerships, or general feedback')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">
                        {getTranslation(dict, 'contact.info.responseTimeTitle', 'Response Time')}
                      </h3>
                      <p className="text-muted-foreground">
                        {getTranslation(dict, 'contact.info.businessHours', 'Monday - Friday: Within 24 hours')}<br />
                        {getTranslation(dict, 'contact.info.weekendHours', 'Weekends: Within 48 hours')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* FAQ Section - Moved below the contact form */}
        <section className="mt-16" aria-labelledby="faq-heading">
          <div className="max-w-4xl mx-auto">
            <h2 id="faq-heading" className="text-2xl font-bold mb-6">
              {getTranslation(dict, 'contact.faq.title', 'Frequently Asked Questions')}
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg">
                <AccordionTrigger className="text-left px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-base">
                    {getTranslation(dict, 'contact.faq.q1', 'How often is content updated?')}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    {getTranslation(dict, 'contact.faq.a1', 'We update our transfer news multiple times daily during transfer windows and regularly throughout the season. Our team works around the clock to bring you the latest confirmed transfers, breaking rumors, and exclusive insights from the world of football.')}
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border rounded-lg">
                <AccordionTrigger className="text-left px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-base">
                    {getTranslation(dict, 'contact.faq.q2', 'Can I submit transfer tips?')}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    {getTranslation(dict, 'contact.faq.a2', 'Yes! We welcome reliable transfer information from our community. Use the contact form above to share tips with our editorial team. Please include as much detail as possible, including sources when available. All submissions are reviewed by our editorial team before publication.')}
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border rounded-lg">
                <AccordionTrigger className="text-left px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-base">
                    {getTranslation(dict, 'contact.faq.q3', 'Do you offer advertising opportunities?')}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    {getTranslation(dict, 'contact.faq.a3', 'We offer various advertising and partnership opportunities including banner ads, sponsored content, and newsletter placements. Our audience consists of passionate football fans interested in transfer news and club updates. Contact us for detailed media kit and pricing information.')}
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border rounded-lg">
                <AccordionTrigger className="text-left px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-base">
                    {getTranslation(dict, 'contact.faq.q4', 'How can I report incorrect information?')}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    {getTranslation(dict, 'contact.faq.a4', 'We take accuracy seriously. If you notice incorrect information in any of our articles, please contact us immediately using the form above. Include the article URL and details about the correction needed. We will investigate and update the content promptly.')}
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="border rounded-lg">
                <AccordionTrigger className="text-left px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-base">
                    {getTranslation(dict, 'contact.faq.q5', 'Can I republish your content?')}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    {getTranslation(dict, 'contact.faq.a5', 'Our content is protected by copyright. For republishing requests, syndication opportunities, or content licensing, please contact us with details about your intended use. We offer various licensing options for media outlets, blogs, and commercial use.')}
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6" className="border rounded-lg">
                <AccordionTrigger className="text-left px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-base">
                    {getTranslation(dict, 'contact.faq.q6', 'Do you have a mobile app?')}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    {getTranslation(dict, 'contact.faq.a6', 'Currently, we focus on providing the best web experience across all devices. Our website is fully responsive and optimized for mobile browsers. We are considering a mobile app for the future - stay tuned for updates!')}
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7" className="border rounded-lg">
                <AccordionTrigger className="text-left px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-base">
                    {getTranslation(dict, 'contact.faq.q7', 'How do you verify transfer information?')}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    {getTranslation(dict, 'contact.faq.a7', 'We use multiple reliable sources including official club announcements, trusted journalists, and verified social media accounts. All information is cross-referenced before publication. We clearly distinguish between confirmed transfers and rumors to maintain transparency.')}
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8" className="border rounded-lg">
                <AccordionTrigger className="text-left px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-base">
                    {getTranslation(dict, 'contact.faq.q8', 'Can I get notifications for specific clubs or players?')}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">
                    {getTranslation(dict, 'contact.faq.a8', 'While we don\'t currently offer personalized notifications, you can follow specific leagues and clubs through our organized sections. We are working on implementing notification features for future updates.')}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </div>
    </div>
  )
}
