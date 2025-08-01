"use client"

import { useState, useEffect } from "react"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Mail, 
  Search, 
  Download,
  Users,
  TrendingUp,
  UserCheck,
  UserX,
  MoreHorizontal
} from "lucide-react"
import { newsletterApi, getAuthHeaders } from "@/lib/api"
import { API_CONFIG } from "@/lib/config"
import { cn } from "@/lib/utils"
import { NewsletterTestPanel } from "@/components/admin/NewsletterTestPanel"

interface NewsletterSubscriber {
  id: string
  email: string
  firstName?: string
  lastName?: string
  status: 'active' | 'unsubscribed' | 'bounced'
  subscribed_at: string
  unsubscribed_at?: string
  preferences?: Record<string, unknown>
  source?: string
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchFilter, setSearchFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([])

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log('🔍 Fetching newsletter subscribers...')
      console.log('📍 API endpoint:', API_CONFIG.endpoints.newsletter.list)
      console.log('🌐 Base URL:', API_CONFIG.baseUrl)
      
      // Check if we have authentication before making the call
      const headers = await getAuthHeaders()
      
      if (!headers.Authorization) {
        console.warn('⚠️ No authentication token available, skipping newsletter API call')
        setError('Authentication required')
        return
      }
      
      const data = await newsletterApi.getSubscriptions()
      console.log('✅ Newsletter subscribers loaded:', data?.length || 0)
      setSubscribers(data || [])
    } catch (err) {
      console.error('💥 Error fetching subscribers:', err)
      setError('Failed to load newsletter subscribers')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnsubscribe = async (subscriberId: string) => {
    try {
      await newsletterApi.unsubscribe(subscriberId)
      setSubscribers(prev => prev.map(sub => 
        sub.id === subscriberId 
          ? { ...sub, status: 'unsubscribed' as const, unsubscribed_at: new Date().toISOString() }
          : sub
      ))
    } catch (err) {
      console.error('Error unsubscribing user:', err)
    }
  }

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = searchFilter === "" || 
      subscriber.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
      subscriber.firstName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      subscriber.lastName?.toLowerCase().includes(searchFilter.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || subscriber.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'unsubscribed': return 'bg-red-100 text-red-800 border-red-200'
      case 'bounced': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const stats = {
    total: subscribers.length,
    active: subscribers.filter(s => s.status === 'active').length,
    unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
    bounced: subscribers.filter(s => s.status === 'bounced').length,
    thisMonth: subscribers.filter(s => {
      const subDate = new Date(s.subscribed_at)
      const now = new Date()
      const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1)
      return subDate >= monthAgo
    }).length
  }

  const kpis = [
    {
      title: "Total Subscribers",
      value: stats.total.toLocaleString(),
      change: `${stats.thisMonth} this month`,
      trend: "up" as const,
      icon: Users
    },
    {
      title: "Active Subscribers",
      value: stats.active.toLocaleString(),
      change: `${((stats.active / Math.max(stats.total, 1)) * 100).toFixed(1)}% of total`,
      trend: "up" as const,
      icon: UserCheck
    },
    {
      title: "Unsubscribed",
      value: stats.unsubscribed.toLocaleString(),
      change: `${((stats.unsubscribed / Math.max(stats.total, 1)) * 100).toFixed(1)}% churn rate`,
      trend: "down" as const,
      icon: UserX
    },
    {
      title: "Growth Rate",
      value: `${stats.thisMonth > 0 ? '+' : ''}${stats.thisMonth}`,
      change: "New subscribers this month",
      trend: stats.thisMonth > 0 ? "up" as const : "neutral" as const,
      icon: TrendingUp
    }
  ]

  const handleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([])
    } else {
      setSelectedSubscribers(filteredSubscribers.map(s => s.id))
    }
  }

  const handleSelectSubscriber = (subscriberId: string) => {
    setSelectedSubscribers(prev => 
      prev.includes(subscriberId)
        ? prev.filter(id => id !== subscriberId)
        : [...prev, subscriberId]
    )
  }

  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'First Name', 'Last Name', 'Status', 'Subscribed Date', 'Source'].join(','),
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.firstName || '',
        sub.lastName || '',
        sub.status,
        formatDate(sub.subscribed_at),
        sub.source || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <AdminPageLayout title="Newsletter Subscribers">
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-2 text-destructive">
            <Mail className="h-4 w-4" />
            <span className="font-medium">Error Loading Subscribers</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <Button 
            onClick={fetchSubscribers}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))
          ) : (
            kpis.map((kpi, index) => {
              const Icon = kpi.icon
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">{kpi.value}</p>
                      <p className="text-xs text-muted-foreground">{kpi.change}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Newsletter Test Panel */}
        <NewsletterTestPanel />

        {/* Subscribers Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Newsletter Subscribers
                </CardTitle>
                <CardDescription>Manage your newsletter subscriber list</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search subscribers..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <div className="flex gap-1">
                  {['all', 'active', 'unsubscribed', 'bounced'].map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className="capitalize"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
                <Button onClick={exportSubscribers} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-4 w-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredSubscribers.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-4 p-4 border-b">
                  <input
                    type="checkbox"
                    checked={selectedSubscribers.length === filteredSubscribers.length}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">
                    {selectedSubscribers.length > 0 
                      ? `${selectedSubscribers.length} selected`
                      : 'Select all'
                    }
                  </span>
                  {selectedSubscribers.length > 0 && (
                    <Button variant="outline" size="sm">
                      Bulk Actions
                    </Button>
                  )}
                </div>

                {filteredSubscribers.map((subscriber) => (
                  <div key={subscriber.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onChange={() => handleSelectSubscriber(subscriber.id)}
                        className="rounded"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{subscriber.email}</p>
                          {(subscriber.firstName || subscriber.lastName) && (
                            <span className="text-sm text-muted-foreground">
                              ({[subscriber.firstName, subscriber.lastName].filter(Boolean).join(' ')})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Subscribed {formatDate(subscriber.subscribed_at)}</span>
                          {subscriber.source && (
                            <span>via {subscriber.source}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge className={cn("text-xs", getStatusColor(subscriber.status))}>
                        {subscriber.status}
                      </Badge>
                      
                      {subscriber.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnsubscribe(subscriber.id)}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Unsubscribe
                        </Button>
                      )}
                      
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No subscribers found</p>
                <p className="text-sm">Newsletter subscribers will appear here once people start subscribing</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  )
}
