import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

const API_BASE_URL = API_CONFIG.baseUrl;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔄 Proxying POST request to AWS API for translation');
    console.log('📦 Request body:', body);
    
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
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/translate-article`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': authHeader // Forward the auth header
        },
        body: JSON.stringify(body)
      });
      
      console.log('📡 AWS API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Translation completed successfully');
        return NextResponse.json(data);
      } else {
        console.error('❌ AWS API error:', response.status);
        const errorText = await response.text();
        console.error('❌ AWS API error details:', errorText);
        
        return NextResponse.json({
          success: false,
          error: `Translation failed: ${response.status}`,
          details: errorText
        }, { status: response.status });
      }
    } catch (awsError) {
      console.error('💥 AWS API failed:', awsError);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to generate translation',
        details: awsError instanceof Error ? awsError.message : 'Unknown error'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('💥 Error in translation proxy:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process translation request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
