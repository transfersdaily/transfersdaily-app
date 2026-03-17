import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '@/lib/config'

const API_BASE_URL = API_CONFIG.baseUrl

export async function GET(request: NextRequest) {
  try {
    // Get Authorization header from the incoming request
    const authHeader = request.headers.get('Authorization')

    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Missing authorization header' },
        { status: 401 }
      )
    }

    // Forward request to AWS backend with auth header
    const response = await fetch(`${API_BASE_URL}/admin/pipeline/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: authHeader,
      },
    })

    if (!response.ok) {
      console.error('Pipeline stats API error:', response.status)
      const errorText = await response.text()
      console.error('Pipeline stats API error details:', errorText)
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Pipeline stats route error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pipeline stats',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
