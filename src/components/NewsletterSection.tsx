"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { newsletterApi } from "@/lib/api"
import { Loader2, CheckCircle, Mail, Users } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setSubscriptionStatus('error')
      return
    }

    setIsSubscribing(true)
    setSubscriptionStatus('idle')

    try {
      const success = await newsletterApi.subscribe(email)
      
      if (success) {
        setSubscriptionStatus('success')
        setEmail('')
      } else {
        setSubscriptionStatus('error')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setSubscriptionStatus('error')
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <section className="py-20 bg-white dark:bg-slate-950 -mx-4 px-4">
      <div className="max-w-full mx-auto">
        <Card className="border-2 border-red-500 shadow-lg bg-white dark:bg-slate-800 focus:outline-none focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-0">
          <CardContent className="p-12 md:p-16">
            {subscriptionStatus === 'success' ? (
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                  Welcome to the Team!
                </h3>
                <p className="text-muted-foreground">
                  Check your email for confirmation and get ready for the latest transfer news.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="bg-red-500 p-3 rounded-full">
                    <Mail className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Never Miss a Transfer!</h3>
                </div>
                
                <p className="text-slate-600 dark:text-slate-200 mb-6 text-sm max-w-2xl mx-auto">
                  Get the latest transfer news, rumors, and done deals delivered straight to your inbox. Be the first to know when your favorite players make their moves across Europe's top leagues.
                </p>

                <form onSubmit={handleNewsletterSubmit} className="mb-6 max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input 
                      type="email" 
                      placeholder="Enter your email address" 
                      className="flex-1 h-11 border-red-500 focus:border-red-600 focus:ring-red-500 focus:outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubscribing}
                      required
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      title="Please enter a valid email address"
                    />
                    <Button 
                      type="submit" 
                      className="h-11 px-6 bg-red-500 hover:bg-red-600 font-medium" 
                      disabled={isSubscribing || !email}
                    >
                      {isSubscribing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        'Subscribe'
                      )}
                    </Button>
                  </div>
                  
                  {subscriptionStatus === 'error' && (
                    <p className="text-sm text-red-500 mt-3">
                      Please check your email and try again.
                    </p>
                  )}
                </form>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Users className="h-4 w-4" />
                  <span>Join 25,000+ subscribers • No spam • Unsubscribe anytime</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}