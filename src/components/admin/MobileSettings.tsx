"use client"

import { useState } from "react"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MobileActionBar } from "@/components/admin/MobileActionBar"
import { MobileImageUpload } from "@/components/admin/MobileImageUpload"
import { 
  Bell, 
  Sun, 
  Shield, 
  Database, 
  Save, 
  User, 
  Globe, 
  Mail,
  Smartphone,
  Monitor,
  Moon
} from "lucide-react"
import { useIsMobile, adminMobileClasses, adminMobileTouchTargets, adminMobileSpacing } from "@/lib/mobile-utils"

// Mobile-optimized Toggle Component
function MobileToggle({ 
  checked, 
  onChange, 
  disabled = false,
  label,
  description 
}: { 
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label: string
  description?: string
}) {
  const isMobile = useIsMobile()
  
  return (
    <div className={`flex items-center justify-between ${adminMobileSpacing.touchTarget} ${isMobile ? 'py-4' : 'py-2'}`}>
      <div className="flex-1 min-w-0">
        <Label className={`text-sm font-medium ${isMobile ? 'text-base' : ''}`}>
          {label}
        </Label>
        {description && (
          <p className={`text-muted-foreground mt-1 ${isMobile ? 'text-sm' : 'text-xs'}`}>
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        className={`relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ml-4 ${
          isMobile ? 'h-8 w-14' : 'h-6 w-11'
        } ${
          checked ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
      >
        <span
          className={`inline-block transform rounded-full bg-white transition-transform ${
            isMobile ? 'h-6 w-6' : 'h-4 w-4'
          } ${
            checked 
              ? (isMobile ? 'translate-x-7' : 'translate-x-6')
              : (isMobile ? 'translate-x-1' : 'translate-x-1')
          }`}
        />
      </button>
    </div>
  )
}

interface SettingsData {
  theme: string
  emailNotifications: boolean
  transferAlerts: boolean
  weeklyDigest: boolean
  dataCollection: boolean
  autoPublish: boolean
  language: string
  timezone: string
  profileImage?: string
}

export function MobileSettings() {
  const isMobile = useIsMobile()
  const [settings, setSettings] = useState<SettingsData>({
    theme: 'system',
    emailNotifications: true,
    transferAlerts: true,
    weeklyDigest: false,
    dataCollection: true,
    autoPublish: false,
    language: 'en',
    timezone: 'UTC'
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Simulate initial data loading
  useState(() => {
    setTimeout(() => {
      setIsInitialLoading(false)
    }, 600)
  })

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleImageUpload = (files: File[]) => {
    console.log('Profile image uploaded:', files)
    // Handle profile image upload
  }

  const updateSetting = (key: keyof SettingsData, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  // Mobile Accordion Layout
  const MobileSettingsLayout = () => (
    <div className="space-y-4 pb-20">
      <Accordion type="single" collapsible className="space-y-4">
        {/* Profile Settings */}
        <AccordionItem value="profile" className="border rounded-lg">
          <AccordionTrigger className={`px-4 py-4 hover:no-underline ${adminMobileSpacing.touchTarget}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-medium">Profile</div>
                <div className="text-sm text-muted-foreground">Personal information</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Profile Picture</Label>
                <MobileImageUpload
                  onUpload={handleImageUpload}
                  maxFiles={1}
                  maxFileSize={5}
                  acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Language</Label>
                <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                  <SelectTrigger className={adminMobileTouchTargets.select}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Timezone</Label>
                <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                  <SelectTrigger className={adminMobileTouchTargets.select}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time</SelectItem>
                    <SelectItem value="PST">Pacific Time</SelectItem>
                    <SelectItem value="GMT">GMT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Appearance Settings */}
        <AccordionItem value="appearance" className="border rounded-lg">
          <AccordionTrigger className={`px-4 py-4 hover:no-underline ${adminMobileSpacing.touchTarget}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sun className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-medium">Appearance</div>
                <div className="text-sm text-muted-foreground">Theme and display</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'system', label: 'System', icon: Monitor }
                  ].map((theme) => {
                    const Icon = theme.icon
                    return (
                      <button
                        key={theme.value}
                        onClick={() => updateSetting('theme', theme.value)}
                        className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                          settings.theme === theme.value
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs font-medium">{theme.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Notifications Settings */}
        <AccordionItem value="notifications" className="border rounded-lg">
          <AccordionTrigger className={`px-4 py-4 hover:no-underline ${adminMobileSpacing.touchTarget}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-medium">Notifications</div>
                <div className="text-sm text-muted-foreground">Email and alerts</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2">
              <MobileToggle
                checked={settings.emailNotifications}
                onChange={(checked) => updateSetting('emailNotifications', checked)}
                label="Email Notifications"
                description="System updates and alerts"
              />
              
              <MobileToggle
                checked={settings.transferAlerts}
                onChange={(checked) => updateSetting('transferAlerts', checked)}
                label="Transfer Alerts"
                description="Major transfer notifications"
              />
              
              <MobileToggle
                checked={settings.weeklyDigest}
                onChange={(checked) => updateSetting('weeklyDigest', checked)}
                label="Weekly Digest"
                description="Weekly summary reports"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Content Management Settings */}
        <AccordionItem value="content" className="border rounded-lg">
          <AccordionTrigger className={`px-4 py-4 hover:no-underline ${adminMobileSpacing.touchTarget}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-medium">Content Management</div>
                <div className="text-sm text-muted-foreground">Publishing settings</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2">
              <MobileToggle
                checked={settings.autoPublish}
                onChange={(checked) => updateSetting('autoPublish', checked)}
                label="Auto-publish Articles"
                description="Automatically publish processed articles"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Privacy & Security Settings */}
        <AccordionItem value="privacy" className="border rounded-lg">
          <AccordionTrigger className={`px-4 py-4 hover:no-underline ${adminMobileSpacing.touchTarget}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-medium">Privacy & Security</div>
                <div className="text-sm text-muted-foreground">Data and privacy</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2">
              <MobileToggle
                checked={settings.dataCollection}
                onChange={(checked) => updateSetting('dataCollection', checked)}
                label="Analytics Collection"
                description="Collect usage data for improvements"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )

  // Desktop Card Layout
  const DesktopSettingsLayout = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Appearance */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sun className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-sm font-medium">Theme</Label>
              <p className="text-xs text-muted-foreground mt-1">Choose your preferred theme</p>
            </div>
            <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <MobileToggle
            checked={settings.emailNotifications}
            onChange={(checked) => updateSetting('emailNotifications', checked)}
            label="Email Notifications"
            description="System updates and alerts"
          />
          
          <MobileToggle
            checked={settings.transferAlerts}
            onChange={(checked) => updateSetting('transferAlerts', checked)}
            label="Transfer Alerts"
            description="Major transfer notifications"
          />
          
          <MobileToggle
            checked={settings.weeklyDigest}
            onChange={(checked) => updateSetting('weeklyDigest', checked)}
            label="Weekly Digest"
            description="Weekly summary reports"
          />
        </CardContent>
      </Card>

      {/* Content Management */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5" />
            Content Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <MobileToggle
            checked={settings.autoPublish}
            onChange={(checked) => updateSetting('autoPublish', checked)}
            label="Auto-publish Articles"
            description="Automatically publish processed articles"
          />
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" />
            Privacy & Data
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <MobileToggle
            checked={settings.dataCollection}
            onChange={(checked) => updateSetting('dataCollection', checked)}
            label="Analytics Collection"
            description="Collect usage data for improvements"
          />
        </CardContent>
      </Card>

      <div className="flex justify-center pt-8">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )

  if (isInitialLoading) {
    return (
      <AdminPageLayout title="Settings">
        <div className="space-y-4">
          {Array.from({ length: isMobile ? 4 : 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: isMobile ? 2 : 3 }).map((_, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className={`rounded-full ${isMobile ? 'h-8 w-14' : 'h-6 w-11'}`} />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout title="Settings">
      {/* Mobile Layout */}
      <div className={adminMobileClasses.mobileOnly}>
        <MobileSettingsLayout />
        <MobileActionBar
          actions={[
            {
              label: "Save Changes",
              onClick: handleSave,
              disabled: isLoading,
              icon: isLoading ? undefined : <Save className="w-4 h-4" />
            }
          ]}
        />
      </div>

      {/* Desktop Layout */}
      <div className={adminMobileClasses.desktopOnly}>
        <DesktopSettingsLayout />
      </div>
    </AdminPageLayout>
  )
}
