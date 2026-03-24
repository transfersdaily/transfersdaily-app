"use client"

import { useState, useEffect } from "react"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { adminApi, getAuthHeaders } from "@/lib/api"
import { API_CONFIG } from "@/lib/config"

export default function DebugStatsPage() {
  const [rawResponse, setRawResponse] = useState<any>(null)
  const [statusDebug, setStatusDebug] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchRawStats = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('🔍 Fetching raw dashboard stats...')
      const response = await adminApi.getDashboardStats()
      console.log('📊 Raw response:', response)
      
      setRawResponse(response)
    } catch (err) {
      console.error('❌ Error fetching stats:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStatusDebug = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('🔍 Fetching status debug...')
      const headers = await getAuthHeaders()
      const response = await fetch(`${API_CONFIG.baseUrl}/admin/debug-status`, {
        method: 'GET',
        headers
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('📊 Status debug response:', data)
      
      setStatusDebug(data.data || data)
    } catch (err) {
      console.error('❌ Error fetching status debug:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRawStats()
    fetchStatusDebug()
  }, [])

  return (
    <AdminPageLayout title="Debug Dashboard Stats">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Raw API Response Debug</h2>
          <div className="space-x-2">
            <Button onClick={fetchRawStats} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Refresh Stats'}
            </Button>
            <Button onClick={fetchStatusDebug} disabled={isLoading} variant="outline">
              {isLoading ? 'Loading...' : 'Debug Status'}
            </Button>
          </div>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-red-700 text-sm overflow-auto">
                {error}
              </pre>
            </CardContent>
          </Card>
        )}

        {statusDebug && (
          <Card>
            <CardHeader>
              <CardTitle>Status Values Debug</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">All Status Values in Database:</h4>
                  <pre className="text-sm bg-gray-100 p-2 rounded">
                    {JSON.stringify(statusDebug.allStatusValues, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recent Status Values (Last 7 Days):</h4>
                  <pre className="text-sm bg-gray-100 p-2 rounded">
                    {JSON.stringify(statusDebug.recentStatusValues, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Sample Published Articles:</h4>
                  <pre className="text-sm bg-gray-100 p-2 rounded">
                    {JSON.stringify(statusDebug.publishedSample, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Raw API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm overflow-auto bg-gray-100 p-4 rounded max-h-96">
              {JSON.stringify(rawResponse, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {rawResponse?.dailyActivity && (
          <Card>
            <CardHeader>
              <CardTitle>Daily Activity Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <strong>Length:</strong> {rawResponse.dailyActivity.length}
                </div>
                <div>
                  <strong>Type:</strong> {typeof rawResponse.dailyActivity}
                </div>
                <div>
                  <strong>Is Array:</strong> {Array.isArray(rawResponse.dailyActivity) ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Sample Items:</strong>
                  <pre className="text-sm bg-gray-100 p-2 rounded mt-2">
                    {JSON.stringify(rawResponse.dailyActivity.slice(0, 3), null, 2)}
                  </pre>
                </div>
                <div>
                  <strong>Daily Breakdown:</strong>
                  <ul className="list-disc list-inside mt-2">
                    {rawResponse.dailyActivity.map((item: any, index: number) => (
                      <li key={index}>
                        {item.date}: {item.draftCount || 0} drafts, {item.publishedCount || 0} published, {item.totalCount || 0} total
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminPageLayout>
  )
}
