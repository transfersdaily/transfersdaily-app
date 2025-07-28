"use client"

import { useState } from "react"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Bell, Sun, Shield, Database } from "lucide-react"

// Custom Toggle Component
function Toggle({ checked, onChange, disabled = false }: { checked: boolean, onChange: (checked: boolean) => void, disabled?: boolean }) {
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        checked ? 'bg-primary' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: 'system',
    emailNotifications: true,
    transferAlerts: true,
    weeklyDigest: false,
    dataCollection: true,
    autoPublish: false
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

  return (
    <AdminPageLayout title="Settings">
      <div className="max-w-4xl mx-auto space-y-8">
        {isInitialLoading ? (
          <>
            {/* Appearance Skeleton */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sun className="h-5 w-5" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Notifications Skeleton */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-11 rounded-full" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Privacy & Security Skeleton */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-28 mb-1" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                  <Skeleton className="h-6 w-11 rounded-full" />
                </div>
              </CardContent>
            </Card>

            {/* Content Management Skeleton */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database className="h-5 w-5" />
                  Content Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-52" />
                  </div>
                  <Skeleton className="h-6 w-11 rounded-full" />
                </div>
              </CardContent>
            </Card>

            {/* Save Button Skeleton */}
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32" />
            </div>
          </>
        ) : (
          <>
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
              <Select value={settings.theme} onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}>
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
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-muted-foreground mt-1">System updates and alerts</p>
              </div>
              <Toggle
                checked={settings.emailNotifications}
                onChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm font-medium">Transfer Alerts</Label>
                <p className="text-xs text-muted-foreground mt-1">Major transfer notifications</p>
              </div>
              <Toggle
                checked={settings.transferAlerts}
                onChange={(checked) => setSettings(prev => ({ ...prev, transferAlerts: checked }))}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm font-medium">Weekly Digest</Label>
                <p className="text-xs text-muted-foreground mt-1">Weekly summary reports</p>
              </div>
              <Toggle
                checked={settings.weeklyDigest}
                onChange={(checked) => setSettings(prev => ({ ...prev, weeklyDigest: checked }))}
              />
            </div>
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
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm font-medium">Auto-publish Articles</Label>
                <p className="text-xs text-muted-foreground mt-1">Automatically publish processed articles</p>
              </div>
              <Toggle
                checked={settings.autoPublish}
                onChange={(checked) => setSettings(prev => ({ ...prev, autoPublish: checked }))}
              />
            </div>
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
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm font-medium">Analytics Collection</Label>
                <p className="text-xs text-muted-foreground mt-1">Collect usage data for improvements</p>
              </div>
              <Toggle
                checked={settings.dataCollection}
                onChange={(checked) => setSettings(prev => ({ ...prev, dataCollection: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-8">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
          </>
        )}
      </div>
    </AdminPageLayout>
  )
}