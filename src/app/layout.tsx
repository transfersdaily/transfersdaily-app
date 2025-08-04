import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth'
import PlausibleProvider from 'next-plausible'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Transfers Daily',
  description: 'Latest football transfer news and updates',
  // Yandex Webmaster verification
  verification: {
    yandex: '37e6e4bf527ef93b'
  },
  // You can also add other search engine verifications here
  // google: 'your-google-verification-code',
  // bing: 'your-bing-verification-code',
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
        
        {/* Google AdSense */}
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
              {children}
            </AuthProvider>
          </ThemeProvider>
        </PlausibleProvider>
      </body>
    </html>
  )
}
