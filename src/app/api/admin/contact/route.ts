import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ti7pb2xkjh.execute-api.us-east-1.amazonaws.com/prod';

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Proxying GET request to AWS API for contact submissions');
    
    // Get Authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
    console.log('🔐 Authorization header present:', !!authHeader);
    
    if (!authHeader) {
      console.error('❌ No Authorization header found in request');
      return NextResponse.json({
        success: false,
        error: 'Missing authorization header'
      }, { status: 401 });
    }
    
    // Forward request to AWS backend with auth header
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': authHeader
        }
      });
      
      console.log('📡 AWS API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      } else {
        console.error('❌ AWS API error:', response.status);
        const errorText = await response.text();
        console.error('❌ AWS API error details:', errorText);
        throw new Error(`AWS API error: ${response.status}`);
      }
    } catch (awsError) {
      console.error('💥 AWS API failed:', awsError);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch contact submissions',
        details: awsError instanceof Error ? awsError.message : 'Unknown error'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('💥 Error in contact proxy:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch contact submissions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
