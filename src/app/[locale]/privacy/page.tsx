import { Metadata } from 'next'
import { type Locale, getDictionary } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  
  const seoData = {
    en: {
      title: 'Privacy Policy - Transfer Daily | How We Protect Your Data',
      description: 'Learn how Transfer Daily collects, uses, and protects your personal information. Our comprehensive privacy policy explains your rights and our data practices.',
    },
    es: {
      title: 'Política de Privacidad - Transfer Daily | Cómo Protegemos Tus Datos',
      description: 'Conoce cómo Transfer Daily recopila, usa y protege tu información personal. Nuestra política de privacidad explica tus derechos y nuestras prácticas de datos.',
    },
    it: {
      title: 'Informativa sulla Privacy - Transfer Daily | Come Proteggiamo i Tuoi Dati',
      description: 'Scopri come Transfer Daily raccoglie, utilizza e protegge le tue informazioni personali. La nostra informativa sulla privacy spiega i tuoi diritti.',
    }
  }

  const currentSeo = seoData[locale] || seoData.en

  return {
    title: currentSeo.title,
    description: currentSeo.description,
    robots: 'index, follow',
    alternates: {
      canonical: locale === 'en' ? '/privacy' : `/${locale}/privacy`,
      languages: {
        'en': '/privacy',
        'es': '/es/privacy',
        'it': '/it/privacy',
        'x-default': '/privacy'
      },
    },
  }
}

export default async function PrivacyPolicyPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <Card>
          <CardContent className="p-8 prose prose-gray dark:prose-invert max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                Welcome to Transfer Daily ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website transferdaily.com and use our services.
              </p>
              <p>
                By accessing or using our website, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium mb-3">2.1 Personal Information</h3>
              <p>We may collect the following types of personal information:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Contact Information:</strong> Name, email address when you subscribe to our newsletter or contact us</li>
                <li><strong>Account Information:</strong> Username, password, and profile information if you create an account</li>
                <li><strong>Communication Data:</strong> Messages you send us through contact forms or email</li>
                <li><strong>Newsletter Preferences:</strong> Your subscription preferences and interests</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Usage Data:</strong> Pages visited, time spent on pages, search queries, click patterns</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong>Location Data:</strong> General geographic location based on IP address</li>
                <li><strong>Cookies and Tracking:</strong> Information collected through cookies and similar technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Content Delivery:</strong> Provide you with football transfer news and updates</li>
                <li><strong>Personalization:</strong> Customize content based on your interests and preferences</li>
                <li><strong>Communication:</strong> Send newsletters, respond to inquiries, and provide customer support</li>
                <li><strong>Website Improvement:</strong> Analyze usage patterns to improve our services</li>
                <li><strong>Security:</strong> Protect against fraud, abuse, and security threats</li>
                <li><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
                <li><strong>Marketing:</strong> Send promotional content (with your consent where required)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
              
              <h3 className="text-xl font-medium mb-3">4.1 Service Providers</h3>
              <p>We may share information with trusted third-party service providers who assist us in:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Website hosting and maintenance</li>
                <li>Email delivery services</li>
                <li>Analytics and performance monitoring</li>
                <li>Customer support services</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">4.2 Legal Requirements</h3>
              <p>We may disclose your information if required by law or in response to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Legal processes, court orders, or government requests</li>
                <li>Enforcement of our terms of service</li>
                <li>Protection of our rights, property, or safety</li>
                <li>Investigation of fraud or security issues</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar tracking technologies to enhance your experience:</p>
              
              <h3 className="text-xl font-medium mb-3">5.1 Types of Cookies</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our website</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">5.2 Managing Cookies</h3>
              <p>You can control cookies through your browser settings. However, disabling certain cookies may affect website functionality.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Encryption:</strong> Data transmission is protected using SSL/TLS encryption</li>
                <li><strong>Access Controls:</strong> Limited access to personal information on a need-to-know basis</li>
                <li><strong>Regular Updates:</strong> Security systems are regularly updated and monitored</li>
                <li><strong>Data Backup:</strong> Regular backups to prevent data loss</li>
              </ul>
              <p>
                While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but will notify you of any data breaches as required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Your Rights and Choices</h2>
              <p>Depending on your location, you may have the following rights:</p>
              
              <h3 className="text-xl font-medium mb-3">7.1 General Rights</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Access:</strong> Request information about the personal data we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Objection:</strong> Object to certain processing of your information</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">7.2 Newsletter and Marketing</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Unsubscribe from newsletters using the link in any email</li>
                <li>Update your communication preferences in your account settings</li>
                <li>Contact us to opt-out of marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers, including:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Adequacy decisions by relevant authorities</li>
                <li>Standard contractual clauses</li>
                <li>Certification schemes and codes of conduct</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
              <p>
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party websites you visit.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Posting the updated policy on our website</li>
                <li>Sending an email notification to registered users</li>
                <li>Displaying a prominent notice on our website</li>
              </ul>
              <p>
                Your continued use of our services after any changes constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-muted p-4 rounded-lg mt-4">
                <p><strong>Transfer Daily</strong></p>
                <p>Email: privacy@transferdaily.com</p>
                <p>Website: <a href="https://transferdaily.com/contact" className="text-primary hover:underline">transferdaily.com/contact</a></p>
                <p>Response Time: We aim to respond to all privacy-related inquiries within 30 days.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Jurisdiction-Specific Rights</h2>
              
              <h3 className="text-xl font-medium mb-3">13.1 European Union (GDPR)</h3>
              <p>If you are located in the EU, you have additional rights under the General Data Protection Regulation (GDPR), including the right to lodge a complaint with your local data protection authority.</p>
              
              <h3 className="text-xl font-medium mb-3">13.2 California (CCPA)</h3>
              <p>California residents have specific rights under the California Consumer Privacy Act, including the right to know what personal information is collected and the right to delete personal information.</p>
              
              <h3 className="text-xl font-medium mb-3">13.3 Other Jurisdictions</h3>
              <p>We comply with applicable privacy laws in all jurisdictions where we operate. Contact us for information about your specific rights.</p>
            </section>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
