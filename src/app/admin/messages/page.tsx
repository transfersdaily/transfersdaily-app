"use client"

import { useState, useEffect } from "react"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Mail, 
  Search, 
  Archive,
  Trash2,
  Reply,
  MoreHorizontal,
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { contactApi } from "@/lib/api"
import { cn } from "@/lib/utils"

interface ContactMessage {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  type?: string
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
  admin_notes?: string
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchFilter, setSearchFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [adminNotes, setAdminNotes] = useState("")

  useEffect(() => {
    fetchMessages()
  }, [statusFilter])

  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await contactApi.getSubmissions({
        status: statusFilter === 'all' ? undefined : statusFilter,
        limit: 100
      })
      setMessages(response.submissions || [])
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError('Failed to load contact messages')
    } finally {
      setIsLoading(false)
    }
  }

  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      await contactApi.updateSubmission(messageId, { status })
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: status as any } : msg
      ))
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(prev => prev ? { ...prev, status: status as any } : null)
      }
    } catch (err) {
      console.error('Error updating message status:', err)
    }
  }

  const saveAdminNotes = async () => {
    if (!selectedMessage) return
    
    try {
      await contactApi.updateSubmission(selectedMessage.id, { adminNotes })
      setSelectedMessage(prev => prev ? { ...prev, admin_notes: adminNotes } : null)
      setMessages(prev => prev.map(msg => 
        msg.id === selectedMessage.id ? { ...msg, admin_notes: adminNotes } : msg
      ))
    } catch (err) {
      console.error('Error saving admin notes:', err)
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = searchFilter === "" || 
      message.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      message.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
      message.subject?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      message.message.toLowerCase().includes(searchFilter.toLowerCase())
    
    return matchesSearch
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return '1d ago'
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'read': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'replied': return <Reply className="h-4 w-4 text-purple-500" />
      case 'archived': return <Archive className="h-4 w-4 text-gray-500" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'read': return 'bg-green-100 text-green-800 border-green-200'
      case 'replied': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  useEffect(() => {
    if (selectedMessage) {
      setAdminNotes(selectedMessage.admin_notes || "")
    }
  }, [selectedMessage])

  return (
    <AdminPageLayout title="Contact Messages">
      <div className="flex h-[800px] border rounded-lg overflow-hidden">
        {/* Messages List */}
        <div className="w-1/3 border-r bg-muted/10">
          <div className="p-4 border-b bg-background">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5" />
              <h2 className="font-semibold">Messages</h2>
              <Badge variant="secondary" className="ml-auto">
                {filteredMessages.length}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <div className="flex gap-1">
                {['all', 'new', 'read', 'replied', 'archived'].map((status) => (
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
            </div>
          </div>

          <ScrollArea className="h-[calc(100%-140px)]">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-3 w-24 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredMessages.length > 0 ? (
              <div className="p-2">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "p-3 mb-2 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                      selectedMessage?.id === message.id && "bg-muted border-primary"
                    )}
                    onClick={() => {
                      setSelectedMessage(message)
                      if (message.status === 'new') {
                        updateMessageStatus(message.id, 'read')
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(message.status)}
                        <span className="font-medium text-sm">{message.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-1">{message.email}</p>
                    
                    <p className="text-sm font-medium mb-1 line-clamp-1">
                      {message.subject || 'No Subject'}
                    </p>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {message.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <Badge className={cn("text-xs", getStatusColor(message.status))}>
                        {message.status}
                      </Badge>
                      {message.type && (
                        <Badge variant="outline" className="text-xs">
                          {message.type}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages found</p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Message Detail */}
        <div className="flex-1 flex flex-col">
          {selectedMessage ? (
            <>
              {/* Message Header */}
              <div className="p-6 border-b bg-background">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-xl font-semibold mb-1">
                      {selectedMessage.subject || 'No Subject'}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {selectedMessage.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {selectedMessage.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {formatDate(selectedMessage.created_at)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs", getStatusColor(selectedMessage.status))}>
                      {selectedMessage.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Mark Replied
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateMessageStatus(selectedMessage.id, 'archived')}
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </Button>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Message</h3>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Admin Notes</h3>
                    <Textarea
                      placeholder="Add internal notes about this message..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button 
                      onClick={saveAdminNotes}
                      className="mt-2"
                      size="sm"
                    >
                      Save Notes
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Select a message</p>
                <p className="text-sm">Choose a message from the list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminPageLayout>
  )
}
