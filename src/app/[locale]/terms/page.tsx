import { Metadata } from 'next'
import Link from 'next/link'
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
      title: 'Terms of Service - Transfer Daily | Website Terms & Conditions',
      description: 'Read Transfer Daily\'s terms of service and conditions for using our football transfer news website. Understand your rights and responsibilities as a user.',
    },
    es: {
      title: 'Términos de Servicio - Transfer Daily | Términos y Condiciones',
      description: 'Lee los términos de servicio y condiciones de Transfer Daily para usar nuestro sitio web de noticias de fichajes de fútbol.',
    },
    it: {
      title: 'Termini di Servizio - Transfer Daily | Termini e Condizioni',
      description: 'Leggi i termini di servizio e le condizioni di Transfer Daily per utilizzare il nostro sito web di notizie di calciomercato.',
    },
    fr: {
      title: 'Conditions d\'Utilisation - Transfer Daily | Termes et Conditions',
      description: 'Lisez les conditions d\'utilisation de Transfer Daily pour utiliser notre site web d\'actualités de transferts de football.',
    },
    de: {
      title: 'Nutzungsbedingungen - Transfer Daily | Geschäftsbedingungen',
      description: 'Lesen Sie die Nutzungsbedingungen von Transfer Daily für die Nutzung unserer Website mit Fußball-Transfer-Nachrichten.',
    }
  }

  const currentSeo = seoData[locale] || seoData.en

  return {
    title: currentSeo.title,
    description: currentSeo.description,
    robots: 'index, follow',
    alternates: {
      canonical: locale === 'en' ? '/terms' : `/${locale}/terms`,
      languages: {
        'en': '/terms',
        'es': '/es/terms',
        'it': '/it/terms',
        'x-default': '/terms'
      },
    },
  }
}

export default async function TermsOfServicePage({
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
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
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
              <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p>
                Welcome to Transfer Daily ("we," "us," "our," or "Transfer Daily"). These Terms of Service ("Terms") govern your use of our website located at transferdaily.com (the "Service") operated by Transfer Daily.
              </p>
              <p>
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p>
                Transfer Daily is a digital platform that provides:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Football Transfer News:</strong> Latest transfer rumors, confirmed deals, and breaking news</li>
                <li><strong>Player Information:</strong> Statistics, profiles, and career information</li>
                <li><strong>Club Updates:</strong> News and information about football clubs worldwide</li>
                <li><strong>League Coverage:</strong> Updates from major football leagues</li>
                <li><strong>Newsletter Service:</strong> Email updates and notifications</li>
                <li><strong>User Interaction:</strong> Comments, discussions, and community features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              
              <h3 className="text-xl font-medium mb-3">3.1 Account Creation</h3>
              <p>To access certain features of our Service, you may be required to create an account. You agree to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">3.2 Account Termination</h3>
              <p>We reserve the right to terminate or suspend your account at any time for violations of these Terms or for any other reason at our sole discretion.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
              
              <h3 className="text-xl font-medium mb-3">4.1 Permitted Uses</h3>
              <p>You may use our Service for:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Reading and accessing football transfer news and information</li>
                <li>Subscribing to our newsletter and updates</li>
                <li>Participating in discussions and community features</li>
                <li>Sharing content through provided social media features</li>
                <li>Contacting us with questions or feedback</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">4.2 Prohibited Uses</h3>
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Spam, harass, or abuse other users</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Distribute malware, viruses, or harmful code</li>
                <li>Scrape or automatically extract content without permission</li>
                <li>Impersonate others or provide false information</li>
                <li>Interfere with the proper functioning of the Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Content and Intellectual Property</h2>
              
              <h3 className="text-xl font-medium mb-3">5.1 Our Content</h3>
              <p>
                All content on Transfer Daily, including but not limited to text, graphics, logos, images, videos, and software, is the property of Transfer Daily or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-medium mb-3">5.2 Limited License</h3>
              <p>We grant you a limited, non-exclusive, non-transferable license to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Access and use the Service for personal, non-commercial purposes</li>
                <li>View and read content on the website</li>
                <li>Share articles through provided social media features</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">5.3 User-Generated Content</h3>
              <p>By submitting content to our Service (comments, feedback, etc.), you:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Retain ownership of your content</li>
                <li>Grant us a worldwide, royalty-free license to use, modify, and display your content</li>
                <li>Represent that you have the right to submit such content</li>
                <li>Agree that your content does not violate these Terms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Privacy and Data Protection</h2>
              <p>
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our Service, you consent to the collection and use of your information as outlined in our Privacy Policy.
              </p>
              <p>
                <Link href="/privacy" className="text-primary hover:underline">View our Privacy Policy</Link>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Third-Party Services and Links</h2>
              <p>
                Our Service may contain links to third-party websites, services, or advertisements. We are not responsible for:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>The content or practices of third-party websites</li>
                <li>The privacy policies of external services</li>
                <li>Any damages or losses caused by third-party services</li>
                <li>The availability or functionality of linked websites</li>
              </ul>
              <p>
                Your use of third-party services is at your own risk and subject to their respective terms and conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Disclaimers and Limitations</h2>
              
              <h3 className="text-xl font-medium mb-3">8.1 Information Accuracy</h3>
              <p>
                While we strive to provide accurate and up-to-date information, we make no warranties about:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>The accuracy, completeness, or reliability of content</li>
                <li>The timeliness of transfer news and updates</li>
                <li>The verification of rumors or unconfirmed reports</li>
                <li>The performance or availability of the Service</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">8.2 Service Availability</h3>
              <p>
                We do not guarantee that the Service will be:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Available at all times without interruption</li>
                <li>Free from errors, bugs, or technical issues</li>
                <li>Compatible with all devices or browsers</li>
                <li>Secure from unauthorized access or cyber attacks</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Transfer Daily shall not be liable for any:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Direct Damages:</strong> Including but not limited to loss of data, profits, or business opportunities</li>
                <li><strong>Indirect Damages:</strong> Consequential, incidental, or punitive damages</li>
                <li><strong>Third-Party Actions:</strong> Damages caused by third-party content or services</li>
                <li><strong>Service Interruptions:</strong> Losses due to downtime or technical issues</li>
                <li><strong>User Content:</strong> Damages arising from user-generated content</li>
              </ul>
              <p>
                Our total liability to you for any claims arising from your use of the Service shall not exceed the amount you paid us in the twelve months preceding the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Transfer Daily, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your user-generated content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
              
              <h3 className="text-xl font-medium mb-3">11.1 Termination by You</h3>
              <p>You may terminate your account at any time by contacting us or using account deletion features if available.</p>

              <h3 className="text-xl font-medium mb-3">11.2 Termination by Us</h3>
              <p>We may terminate or suspend your access immediately, without prior notice, for:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Violation of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Abuse of the Service or other users</li>
                <li>Any other reason at our sole discretion</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">11.3 Effect of Termination</h3>
              <p>Upon termination:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Your right to use the Service ceases immediately</li>
                <li>We may delete your account and associated data</li>
                <li>Provisions that should survive termination will remain in effect</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of material changes by:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Posting updated Terms on our website</li>
                <li>Sending email notifications to registered users</li>
                <li>Displaying prominent notices on the Service</li>
              </ul>
              <p>
                Your continued use of the Service after changes become effective constitutes acceptance of the new Terms. If you do not agree to the modified Terms, you must stop using the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Governing Law and Jurisdiction</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be resolved in the courts of [Your Jurisdiction].
              </p>
              <p>
                If you are located in the European Union, you may also have the right to bring proceedings in the courts of your country of residence.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">14. Dispute Resolution</h2>
              
              <h3 className="text-xl font-medium mb-3">14.1 Informal Resolution</h3>
              <p>Before filing any formal dispute, we encourage you to contact us to seek a resolution.</p>

              <h3 className="text-xl font-medium mb-3">14.2 Arbitration</h3>
              <p>
                Any disputes that cannot be resolved informally may be subject to binding arbitration, except where prohibited by law. The arbitration will be conducted in accordance with the rules of [Arbitration Organization].
              </p>

              <h3 className="text-xl font-medium mb-3">14.3 Class Action Waiver</h3>
              <p>
                You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">15. Miscellaneous</h2>
              
              <h3 className="text-xl font-medium mb-3">15.1 Entire Agreement</h3>
              <p>These Terms, together with our Privacy Policy, constitute the entire agreement between you and Transfer Daily.</p>

              <h3 className="text-xl font-medium mb-3">15.2 Severability</h3>
              <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.</p>

              <h3 className="text-xl font-medium mb-3">15.3 Waiver</h3>
              <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>

              <h3 className="text-xl font-medium mb-3">15.4 Assignment</h3>
              <p>We may assign our rights and obligations under these Terms without restriction. You may not assign your rights without our prior written consent.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">16. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-muted p-4 rounded-lg mt-4">
                <p><strong>Transfer Daily</strong></p>
                <p>Email: legal@transferdaily.com</p>
                <p>Website: <a href="https://transferdaily.com/contact" className="text-primary hover:underline">transferdaily.com/contact</a></p>
                <p>Response Time: We aim to respond to all legal inquiries within 5-7 business days.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">17. Acknowledgment</h2>
              <p>
                By using Transfer Daily, you acknowledge that you have read these Terms of Service, understand them, and agree to be bound by them. If you do not agree to these Terms, you are not authorized to use our Service.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                These Terms of Service are effective as of the date last updated above and will remain in effect except with respect to any changes in their provisions in the future, which will be in effect immediately after being posted on this page.
              </p>
            </section>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
