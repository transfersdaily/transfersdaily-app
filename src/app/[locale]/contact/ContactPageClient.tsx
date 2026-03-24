"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
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

export function ContactPageClient({ locale, dict }: ContactPageClientProps) {
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
    <div className="container mx-auto max-w-3xl px-4 md:px-6">
        <div>
          {/* Page Header */}
          <section className="py-6 md:py-10">
            <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-foreground">
              {getTranslation(dict, 'contact.title', 'Get in Touch')}
            </h1>
            <p className="font-sans text-base text-muted-foreground leading-relaxed mt-3 max-w-2xl">
              {getTranslation(dict, 'contact.subtitle', "Have a question, suggestion, or want to collaborate? We'd love to hear from you.")}
            </p>
          </section>

          {/* Contact Form */}
          <section className="py-8 border-t border-border" aria-labelledby="contact-form-heading">
            <h2 id="contact-form-heading" className="font-display text-lg md:text-xl font-bold uppercase tracking-tight text-foreground mb-6">
              {getTranslation(dict, 'contact.form.title', 'Send us a Message')}
            </h2>

            {submitStatus === 'success' ? (
              <div className="py-8">
                <h3 className="font-display text-base font-bold uppercase tracking-tight text-green-500 mb-2">
                  {getTranslation(dict, 'contact.success.title', 'Message Sent Successfully!')}
                </h3>
                <p className="font-sans text-base text-muted-foreground mb-4">
                  {getTranslation(dict, 'contact.success.message', "Thank you for contacting us. We'll get back to you within 24 hours.")}
                </p>
                <Button
                  onClick={() => setSubmitStatus('idle')}
                  variant="outline"
                  className="border-border"
                >
                  {getTranslation(dict, 'contact.success.sendAnother', 'Send Another Message')}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="font-sans text-sm font-medium text-foreground block mb-2">
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
                      className="bg-secondary border-border focus:border-primary focus:ring-primary min-h-[44px] text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="font-sans text-sm font-medium text-foreground block mb-2">
                      {getTranslation(dict, 'contact.form.lastName', 'Last Name')}
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder={getTranslation(dict, 'contact.form.lastNamePlaceholder', 'Enter your last name')}
                      disabled={isSubmitting}
                      className="bg-secondary border-border focus:border-primary focus:ring-primary min-h-[44px] text-base"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="font-sans text-sm font-medium text-foreground block mb-2">
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
                    className="bg-secondary border-border focus:border-primary focus:ring-primary min-h-[44px] text-base"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="font-sans text-sm font-medium text-foreground block mb-2">
                    {getTranslation(dict, 'contact.form.subject', 'Subject')}
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder={getTranslation(dict, 'contact.form.subjectPlaceholder', "What's this about?")}
                    disabled={isSubmitting}
                    className="bg-secondary border-border focus:border-primary focus:ring-primary min-h-[44px] text-base"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="font-sans text-sm font-medium text-foreground block mb-2">
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
                    className="bg-secondary border-border focus:border-primary focus:ring-primary resize-none text-base"
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
          </section>

          {/* Contact Information */}
          <section className="py-8 border-t border-border" aria-labelledby="contact-info-heading">
            <h2 id="contact-info-heading" className="font-display text-lg md:text-xl font-bold uppercase tracking-tight text-foreground mb-6">
              {getTranslation(dict, 'contact.info.title', 'Contact Information')}
            </h2>
            <div className="space-y-4 max-w-xl">
              <div className="p-4 border border-border rounded-lg">
                <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground mb-1">
                  {getTranslation(dict, 'contact.info.email', 'Email')}
                </h3>
                <p className="font-sans text-base text-muted-foreground">contact@transfersdaily.com</p>
                <p className="font-sans text-sm text-muted-foreground mt-1">
                  {getTranslation(dict, 'contact.info.responseTime', 'We typically respond within 24 hours')}
                </p>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground mb-1">
                  {getTranslation(dict, 'contact.info.inquiries', 'General Inquiries')}
                </h3>
                <p className="font-sans text-base text-muted-foreground">
                  {getTranslation(dict, 'contact.info.inquiriesDesc', 'Questions about our content, partnerships, or general feedback')}
                </p>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground mb-1">
                  {getTranslation(dict, 'contact.info.responseTimeTitle', 'Response Time')}
                </h3>
                <p className="font-sans text-base text-muted-foreground">
                  {getTranslation(dict, 'contact.info.businessHours', 'Monday - Friday: Within 24 hours')}<br />
                  {getTranslation(dict, 'contact.info.weekendHours', 'Weekends: Within 48 hours')}
                </p>
              </div>
            </div>
          </section>

        </div>
    </div>
  )
}
