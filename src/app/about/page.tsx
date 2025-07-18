import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Globe, Zap, Trophy } from "lucide-react"
import { Footer } from "@/components/Footer"
import { Sidebar } from "@/components/Sidebar"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-screen">
          <div className="lg:col-span-8">
            {/* Hero Section */}
            <section className="py-8">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="bg-red-500 p-3 rounded-lg">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold">
                    <span className="text-red-500">Transfers</span>
                    <span className="text-foreground">Daily</span>
                  </div>
                </div>
                <Badge variant="outline" className="mb-4">About Us</Badge>
                <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-slate-100">
                  Your Trusted Source for Football Transfer News
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-200 leading-relaxed max-w-3xl mx-auto">
                  TransfersDaily delivers the latest football transfer news, rumors, and analysis 
                  from around the world. We're passionate about bringing you accurate, timely, 
                  and comprehensive coverage of the transfer market.
                </p>
              </div>
            </section>

            {/* Mission Section */}
            <section className="bg-muted/30 py-8 -mx-4 px-4 mb-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-8">Our Mission</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                        <Clock className="h-6 w-6 text-red-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-3">Real-Time Updates</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        We monitor multiple sources 24/7 to bring you the latest transfer news 
                        as it happens, ensuring you never miss a major move.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                        <Users className="h-6 w-6 text-red-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-3">Community Focused</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Built for football fans by football fans. We understand what matters 
                        most to supporters and deliver content that resonates.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                        <Globe className="h-6 w-6 text-red-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-3">Global Coverage</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        From the Premier League to Serie A, La Liga to the Bundesliga, 
                        we cover transfers across all major European leagues and beyond.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                        <Zap className="h-6 w-6 text-red-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-3">Advanced Technology</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Our platform uses cutting-edge technology to aggregate, analyze, 
                        and present transfer news in the most accessible way possible.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Story Section */}
            <section className="py-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-8">Our Story</h2>
                <div className="space-y-6 text-slate-600 dark:text-slate-200">
                  <p className="text-base leading-relaxed">
                    TransfersDaily was born from a simple frustration: the difficulty of finding 
                    reliable, up-to-date transfer news in one place. As passionate football fans, 
                    we found ourselves constantly switching between multiple sources, trying to 
                    piece together the latest transfer developments.
                  </p>
                  <p className="text-base leading-relaxed">
                    In 2025, we decided to solve this problem by creating a centralized platform 
                    that aggregates transfer news from trusted sources worldwide. Our goal was 
                    simple: make it easier for football fans to stay informed about the transfer 
                    market without the hassle of visiting multiple websites.
                  </p>
                  <p className="text-base leading-relaxed">
                    Today, TransfersDaily serves thousands of football fans daily, providing 
                    them with the latest transfer news, rumors, and analysis. We're proud to 
                    be part of the global football community and committed to continuously 
                    improving our service.
                  </p>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="bg-muted/30 py-8 -mx-4 px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-8">By the Numbers</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500 mb-2">25K+</div>
                    <div className="text-sm font-medium">Newsletter Subscribers</div>
                    <div className="text-xs text-muted-foreground">Growing daily</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500 mb-2">100+</div>
                    <div className="text-sm font-medium">Daily Articles</div>
                    <div className="text-xs text-muted-foreground">Fresh content</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500 mb-2">5</div>
                    <div className="text-sm font-medium">Major Leagues</div>
                    <div className="text-xs text-muted-foreground">Comprehensive coverage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500 mb-2">24/7</div>
                    <div className="text-sm font-medium">News Monitoring</div>
                    <div className="text-xs text-muted-foreground">Never miss a story</div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
