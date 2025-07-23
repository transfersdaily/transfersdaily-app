"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageSquare, Clock, CheckCircle, Loader2 } from "lucide-react"
import { contactApi } from "@/lib/api"
import { trackContactSubmission } from "@/lib/analytics"
import { type Locale } from "@/lib/i18n"

interface ContactPageClientProps {
  locale: Locale
  dict: any
}

// Helper function to get translation
function getTranslation(dict: any, key: string, fallback: string): string {
  const keys = key.split('.')
  let result: any = dict
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k]
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
    <div className="container mx-auto px-4 py-12">
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
                        <label htmlFor="firstName" className="block text-sm font-medium mb-2">
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
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                          {getTranslation(dict, 'contact.form.lastName', 'Last Name')}
                        </label>
                        <Input 
                          id="lastName" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder={getTranslation(dict, 'contact.form.lastNamePlaceholder', 'Enter your last name')}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
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
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        {getTranslation(dict, 'contact.form.subject', 'Subject')}
                      </label>
                      <Input 
                        id="subject" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder={getTranslation(dict, 'contact.form.subjectPlaceholder', "What's this about?")}
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
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
                      />
                    </div>

                    {submitStatus === 'error' && (
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-destructive text-sm">{errorMessage}</p>
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
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

            {/* FAQ Section */}
            <section className="mt-8" aria-labelledby="faq-heading">
              <h3 id="faq-heading" className="text-xl font-bold mb-4">
                {getTranslation(dict, 'contact.faq.title', 'Frequently Asked Questions')}
              </h3>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">
                      {getTranslation(dict, 'contact.faq.q1', 'How often is content updated?')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {getTranslation(dict, 'contact.faq.a1', 'We update our transfer news multiple times daily during transfer windows and regularly throughout the season.')}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">
                      {getTranslation(dict, 'contact.faq.q2', 'Can I submit transfer tips?')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {getTranslation(dict, 'contact.faq.a2', 'Yes! Use the contact form above to share reliable transfer information with our editorial team.')}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">
                      {getTranslation(dict, 'contact.faq.q3', 'Do you offer advertising opportunities?')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {getTranslation(dict, 'contact.faq.a3', 'We offer various advertising and partnership opportunities. Contact us for more information.')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </section>
        </div>
      </div>
    </div>
  )
}
