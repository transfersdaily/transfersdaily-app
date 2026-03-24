"use client"

import { useState } from "react"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAuthHeaders } from "@/lib/api"
import { API_CONFIG } from "@/lib/config"

export default function TestAuthPage() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testAuth = async () => {
    setLoading(true)
    setResult("")
    
    try {
      console.log("🔍 Testing authentication...")
      
      // Test 1: Check if we can get auth headers
      const headers = await getAuthHeaders()
      console.log("✅ Auth headers:", headers)
      setResult(prev => prev + "✅ Auth headers obtained\n")
      
      // Test 2: Try to call a working endpoint (admin/stats)
      const statsResponse = await fetch(`${API_CONFIG.baseUrl}/admin/stats`, {
        headers
      })
      console.log("📊 Stats response status:", statsResponse.status)
      setResult(prev => prev + `📊 Stats endpoint: ${statsResponse.status}\n`)
      
      // Test 3: Try to call clubs endpoint
      const clubsResponse = await fetch(`${API_CONFIG.baseUrl}/admin/clubs?lang=en`, {
        headers
      })
      console.log("🏟️ Clubs response status:", clubsResponse.status)
      setResult(prev => prev + `🏟️ Clubs endpoint: ${clubsResponse.status}\n`)
      
      if (clubsResponse.ok) {
        const clubsData = await clubsResponse.json()
        console.log("🏟️ Clubs data:", clubsData)
        setResult(prev => prev + `🏟️ Clubs data received: ${JSON.stringify(clubsData, null, 2)}\n`)
      } else {
        const errorText = await clubsResponse.text()
        console.log("❌ Clubs error:", errorText)
        setResult(prev => prev + `❌ Clubs error: ${errorText}\n`)
      }
      
    } catch (error) {
      console.error("💥 Test error:", error)
      setResult(prev => prev + `💥 Error: ${error}\n`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminPageLayout title="Authentication Test">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testAuth} disabled={loading}>
              {loading ? "Testing..." : "Test Authentication"}
            </Button>
            
            {result && (
              <div className="bg-gray-100 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm">{result}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  )
}
