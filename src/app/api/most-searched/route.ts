import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '10'
    const days = searchParams.get('days') || '30'

    // In development, proxy to the actual API Gateway
    const apiUrl = `https://q8130q5lpd.execute-api.us-east-1.amazonaws.com/prod/most-searched?limit=${limit}&days=${days}`
    
    console.log('🔄 Proxying most-searched request to:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('❌ API Gateway response not ok:', response.status, response.statusText)
      throw new Error(`API Gateway responded with ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ Successfully proxied most-searched data:', data)

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error('❌ Error in most-searched proxy:', error)
    
    // Return empty result instead of error to prevent UI breaking
    return NextResponse.json({
      success: true,
      data: {
        mostSearched: [],
        total: 0,
        error: 'Failed to load trending searches'
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
