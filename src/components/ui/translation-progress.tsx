'use client';

import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Globe, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Clock
} from 'lucide-react';

interface TranslationProgressProps {
  status: {
    status: string;
    message: string;
    progress: {
      percentage: number;
      completed: number;
      total: number;
    };
    translations?: Array<{
      language_code: string;
      title: string;
      content_length: number;
      created_at: string;
    }>;
    isComplete: boolean;
    isFailed: boolean;
  };
  targetLanguages?: string[];
}

const languageNames: Record<string, { name: string; flag: string }> = {
  'en': { name: 'English', flag: '🇬🇧' },
  'es': { name: 'Spanish', flag: '🇪🇸' },
  'fr': { name: 'French', flag: '🇫🇷' },
  'de': { name: 'German', flag: '🇩🇪' },
  'it': { name: 'Italian', flag: '🇮🇹' }
};

export function TranslationProgress({ status, targetLanguages = ['es', 'fr', 'de', 'it'] }: TranslationProgressProps) {
  const getStatusIcon = () => {
    if (status.isFailed) {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
    if (status.isComplete) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
  };

  const getStatusColor = () => {
    if (status.isFailed) return 'destructive';
    if (status.isComplete) return 'default';
    return 'secondary';
  };

  const completedLanguages = status.translations?.map(t => t.language_code) || [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Translation Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">{status.message}</span>
          </div>
          <Badge variant={getStatusColor()}>
            {status.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Overall Progress</span>
            <span>{status.progress.completed}/{status.progress.total} languages</span>
          </div>
          <Progress value={status.progress.percentage} className="h-2" />
          <div className="text-center text-sm font-medium">
            {status.progress.percentage}% Complete
          </div>
        </div>

        {/* Language Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Language Status</h4>
          <div className="grid grid-cols-2 gap-2">
            {targetLanguages.map((langCode) => {
              const lang = languageNames[langCode];
              const isCompleted = completedLanguages.includes(langCode);
              const translation = status.translations?.find(t => t.language_code === langCode);
              
              return (
                <div
                  key={langCode}
                  className={`flex items-center justify-between p-2 rounded-lg border ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                      : 'bg-muted border-border'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{lang?.flag || '🏳️'}</span>
                    <span className="text-sm font-medium">
                      {lang?.name || langCode.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : status.status === 'translating' ? (
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed Translations Details */}
        {status.translations && status.translations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Completed Translations</h4>
            <div className="space-y-1">
              {status.translations.map((translation) => {
                const lang = languageNames[translation.language_code];
                return (
                  <div
                    key={translation.language_code}
                    className="flex items-center justify-between text-xs p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center gap-2">
                      <span>{lang?.flag || '🏳️'}</span>
                      <span className="font-medium">{lang?.name || translation.language_code}</span>
                    </div>
                    <div className="text-muted-foreground">
                      {translation.content_length} chars
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Message */}
        {status.isFailed && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Translation Failed</span>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              The translation process encountered an error. Please try again or contact support if the issue persists.
            </p>
          </div>
        )}

        {/* Success Message */}
        {status.isComplete && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Translation Complete!</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              All translations have been generated and saved successfully. You can now review and edit them in each language tab.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
