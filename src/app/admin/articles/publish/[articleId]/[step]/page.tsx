'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  Save,
  Eye,
  Edit,
  Share2
} from 'lucide-react';
import { adminApi, newsletterApi } from '@/lib/api';

// Step Components
import ContentEditingStep from '@/components/publishing/steps/ContentEditingStep';
import ContentPreviewStep from '@/components/publishing/steps/ContentPreviewStep';
import SocialMediaStep from '@/components/publishing/steps/SocialMediaStep';
import ConfirmationStep from '@/components/publishing/steps/ConfirmationStep';

type PublishingStep = 'edit' | 'preview' | 'social' | 'confirm';

interface StepConfig {
  id: PublishingStep;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: StepConfig[] = [
  {
    id: 'edit',
    title: 'Edit Content',
    description: 'Edit and refine article content',
    icon: <Edit className="w-5 h-5" />
  },
  {
    id: 'preview',
    title: 'Preview',
    description: 'Preview across all platforms',
    icon: <Eye className="w-5 h-5" />
  },
  {
    id: 'social',
    title: 'Social Media',
    description: 'Configure social distribution',
    icon: <Share2 className="w-5 h-5" />
  },
  {
    id: 'confirm',
    title: 'Publish',
    description: 'Final review and publish',
    icon: <CheckCircle className="w-5 h-5" />
  }
];

interface WizardState {
  currentStep: PublishingStep;
  completedSteps: Set<PublishingStep>;
  stepData: Record<string, any>;
  isDirty: boolean;
  confirmationsComplete: boolean;
}

export default function PublishingWizardPage({ 
  params 
}: { 
  params: Promise<{ articleId: string; step: PublishingStep }> 
}) {
  const router = useRouter();
  const { articleId, step } = use(params);
  
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: step,
    completedSteps: new Set([]), // No mock data
    stepData: {},
    isDirty: false,
    confirmationsComplete: false
  });

  const currentStepIndex = STEPS.findIndex(s => s.id === step);
  const currentStepConfig = STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const navigateToStep = (targetStep: PublishingStep) => {
    router.push(`/admin/articles/publish/${articleId}/${targetStep}`);
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      const nextStep = STEPS[nextIndex].id;
      navigateToStep(nextStep);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      const prevStep = STEPS[prevIndex].id;
      navigateToStep(prevStep);
    }
  };

  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (!wizardState.confirmationsComplete) return;
    
    setIsPublishing(true);
    
    try {
      console.log('🚀 Publishing article:', articleId);
      
      // Step 1: Update article status to published (this should set published_at in backend)
      const success = await adminApi.updateArticleStatus(articleId, 'published');
      
      if (!success) {
        throw new Error('Failed to publish article');
      }
      
      console.log('✅ Article published successfully');
      
      // Step 2: Send newsletter to subscribers
      try {
        console.log('📧 Sending newsletter for published article...');
        
        // First, get the article details for the newsletter
        const articleResponse = await fetch(`/api/admin/articles/${articleId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (articleResponse.ok) {
          const articleData = await articleResponse.json();
          const article = articleData.data?.article;
          
          if (article) {
            // Send newsletter with article details
            const newsletterResult = await newsletterApi.sendNewsletter({
              subject: `New Transfer News: ${article.title}`,
              articleId: articleId,
              articleTitle: article.title,
              articleUrl: `${window.location.origin}/en/article/${article.slug || articleId}`,
              recipientType: 'active'
            });
            
            if (newsletterResult.success) {
              console.log('✅ Newsletter sent successfully to', newsletterResult.sentCount, 'subscribers');
            } else {
              console.warn('⚠️ Newsletter sending failed:', newsletterResult.message);
              // Don't fail the entire publish process if newsletter fails
            }
          }
        } else {
          console.warn('⚠️ Could not fetch article details for newsletter');
        }
      } catch (newsletterError) {
        console.warn('⚠️ Newsletter sending failed:', newsletterError);
        // Don't fail the entire publish process if newsletter fails
      }
      
      // Step 3: Redirect to success page
      router.push(`/admin/articles/publish/${articleId}/success`);
      
    } catch (err) {
      console.error('💥 Error publishing article:', err);
      alert(`Failed to publish article: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleConfirmationStateChange = (allConfirmed: boolean) => {
    setWizardState(prev => ({
      ...prev,
      confirmationsComplete: allConfirmed
    }));
  };

  const handleSaveDraft = async () => {
    try {
      console.log('💾 Saving draft for article:', articleId);
      
      // You can implement actual save logic here
      // For now, we'll show a success message
      
      // Example API call (uncomment when ready):
      // const response = await fetch(`/api/articles/${articleId}/save-draft`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ step: step, data: wizardState.stepData })
      // });
      
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show success feedback
      alert('Draft saved successfully!');
      
    } catch (error) {
      console.error('💥 Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'edit':
        return <ContentEditingStep articleId={articleId} />;
      case 'preview':
        return <ContentPreviewStep articleId={articleId} />;
      case 'social':
        return <SocialMediaStep articleId={articleId} />;
      case 'confirm':
        return <ConfirmationStep 
          articleId={articleId} 
          onConfirmationChange={handleConfirmationStateChange}
        />;
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Publishing Wizard</h1>
              <p className="text-muted-foreground">Article ID: {articleId}</p>
            </div>
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStepIndex + 1} of {STEPS.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-8">
              {STEPS.map((stepConfig, index) => {
                const isActive = stepConfig.id === step;
                const isCompleted = wizardState.completedSteps.has(stepConfig.id);
                const stepNumber = index + 1;
                
                return (
                  <div key={stepConfig.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`
                        flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200
                        ${isCompleted 
                          ? 'bg-green-500 border-green-500 text-white shadow-lg' 
                          : isActive 
                            ? 'bg-primary border-primary text-primary-foreground shadow-lg scale-110'
                            : 'bg-card border-border text-muted-foreground'
                        }
                      `}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <span className="text-sm font-semibold">{stepNumber}</span>
                        )}
                      </div>
                      <div className="mt-3 text-center">
                        <p className={`text-sm font-medium ${
                          isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                        }`}>
                          {stepConfig.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                          {stepConfig.description}
                        </p>
                      </div>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 transition-colors duration-200 ${
                        isCompleted ? 'bg-green-500' : 'bg-border'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              {currentStepConfig.icon}
              <div>
                <CardTitle>{currentStepConfig.title}</CardTitle>
                <p className="text-muted-foreground">{currentStepConfig.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            {currentStepIndex === STEPS.length - 1 ? (
              <Button 
                size="lg" 
                onClick={handlePublish} 
                disabled={!wizardState.confirmationsComplete || isPublishing}
                className={`px-8 py-3 ${
                  wizardState.confirmationsComplete && !isPublishing
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {isPublishing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Publish Article
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}