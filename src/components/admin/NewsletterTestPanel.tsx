'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  Send, 
  AlertCircle, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import { newsletterApi } from '@/lib/api';

interface NewsletterTestPanelProps {
  articleId?: string;
  articleTitle?: string;
  articleSlug?: string;
}

export function NewsletterTestPanel({ 
  articleId, 
  articleTitle, 
  articleSlug 
}: NewsletterTestPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    sentCount?: number;
  } | null>(null);
  
  const [formData, setFormData] = useState({
    subject: articleTitle ? `New Transfer News: ${articleTitle}` : 'Test Newsletter',
    customContent: '',
    recipientType: 'test' as 'all' | 'active' | 'test',
    testEmail: ''
  });

  const handleSendNewsletter = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const newsletterData = {
        subject: formData.subject,
        ...(articleId && { articleId }),
        ...(articleTitle && { articleTitle }),
        ...(articleSlug && { 
          articleUrl: `${window.location.origin}/en/article/${articleSlug}` 
        }),
        ...(formData.customContent && { customContent: formData.customContent }),
        recipientType: formData.recipientType,
        ...(formData.recipientType === 'test' && formData.testEmail && { 
          testEmail: formData.testEmail 
        })
      };
      
      console.log('📧 Sending newsletter with data:', newsletterData);
      
      const response = await newsletterApi.sendNewsletter(newsletterData);
      
      setResult(response);
      
    } catch (error) {
      console.error('💥 Error sending newsletter:', error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Newsletter Test Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subject */}
        <div>
          <Label htmlFor="subject">Email Subject</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Newsletter subject line"
          />
        </div>

        {/* Custom Content */}
        <div>
          <Label htmlFor="customContent">Custom Content (Optional)</Label>
          <Textarea
            id="customContent"
            value={formData.customContent}
            onChange={(e) => setFormData(prev => ({ ...prev, customContent: e.target.value }))}
            placeholder="Additional content to include in the newsletter"
            rows={3}
          />
        </div>

        {/* Recipient Type */}
        <div>
          <Label htmlFor="recipientType">Send To</Label>
          <select
            id="recipientType"
            value={formData.recipientType}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              recipientType: e.target.value as 'all' | 'active' | 'test' 
            }))}
            className="w-full p-2 border border-border rounded-md bg-background"
          >
            <option value="test">Test Email Only</option>
            <option value="active">Active Subscribers</option>
            <option value="all">All Subscribers</option>
          </select>
        </div>

        {/* Test Email */}
        {formData.recipientType === 'test' && (
          <div>
            <Label htmlFor="testEmail">Test Email Address</Label>
            <Input
              id="testEmail"
              type="email"
              value={formData.testEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, testEmail: e.target.value }))}
              placeholder="test@example.com"
            />
          </div>
        )}

        {/* Article Info */}
        {articleId && (
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm font-medium">Article Details:</p>
            <p className="text-sm text-muted-foreground">ID: {articleId}</p>
            {articleTitle && <p className="text-sm text-muted-foreground">Title: {articleTitle}</p>}
            {articleSlug && <p className="text-sm text-muted-foreground">Slug: {articleSlug}</p>}
          </div>
        )}

        {/* Send Button */}
        <Button 
          onClick={handleSendNewsletter}
          disabled={isLoading || !formData.subject || (formData.recipientType === 'test' && !formData.testEmail)}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending Newsletter...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Newsletter
            </>
          )}
        </Button>

        {/* Result */}
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {result.message}
              {result.success && result.sentCount && (
                <span className="block mt-1 font-medium">
                  Sent to {result.sentCount} recipients
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
