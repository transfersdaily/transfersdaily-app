import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import PlausibleProvider from 'next-plausible'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://transfersdaily.com'),
  title: 'Transfers Daily',
  description: 'Latest football transfer news and updates',
  // Search engine verification
  verification: {
    yandex: '37e6e4bf527ef93b',
    other: {
      'msvalidate.01': '151EC670865590C0F31CA873198F81E5'
    }
  },
  // You can also add Google verification here when needed
  // google: 'your-google-verification-code',
}

// Root layout - handles admin routes and provides global providers
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/logo.png" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Search Engine Verification */}
        <meta name="yandex-verification" content="37e6e4bf527ef93b" />
        <meta name="msvalidate.01" content="151EC670865590C0F31CA873198F81E5" />
        {/* <meta name="google-site-verification" content="YOUR_GOOGLE_CODE_HERE" /> */}
        
        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-6269937543968234" />
        
        {/* Prevent theme flicker by setting initial theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('transfers-daily-theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        
        {/* Google AdSense Script */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6269937543968234"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <PlausibleProvider 
          domain="transfersdaily.com"
          trackOutboundLinks={true}
          trackFileDownloads={true}
          enabled={process.env.NODE_ENV === 'production'}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="transfers-daily-theme"
          >
            <AuthProvider>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </AuthProvider>
          </ThemeProvider>
        </PlausibleProvider>
      </body>
    </html>
  )
}
