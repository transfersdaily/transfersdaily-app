import './globals.css'
import { Bebas_Neue, Source_Sans_3 } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import Script from 'next/script'

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://transfersdaily.com'),
  title: 'Transfers Daily',
  description: 'Latest football transfer news and updates',
  verification: {
    yandex: '37e6e4bf527ef93b',
    other: {
      'msvalidate.01': '151EC670865590C0F31CA873198F81E5'
    }
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/logo.png" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        <meta name="yandex-verification" content="37e6e4bf527ef93b" />
        <meta name="msvalidate.01" content="151EC670865590C0F31CA873198F81E5" />

        <meta name="google-adsense-account" content="ca-pub-6269937543968234" />

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6269937543968234"
          crossOrigin="anonymous"
        />

        <Script src="https://www.googletagmanager.com/gtag/js?id=G-2VJKVM04W7" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2VJKVM04W7');`}
        </Script>
      </head>
      <body className={`${sourceSans.variable} ${bebasNeue.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          storageKey="transfers-daily-theme"
        >
          <AuthProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
