import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

const API_BASE_URL = API_CONFIG.baseUrl;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { country } = await request.json();

    console.log(`🔄 Updating league ${id} country to:`, country);
    
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

    // Validate input
    if (!country || typeof country !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Country is required and must be a string'
      }, { status: 400 });
    }

    const trimmedCountry = country.trim();
    if (trimmedCountry.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Country cannot be empty'
      }, { status: 400 });
    }

    // Forward request to AWS backend
    try {
      const response = await fetch(`${API_BASE_URL}/leagues/${id}/country`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({ country: trimmedCountry })
      });
      
      console.log('📡 AWS API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ League country updated successfully');
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
        error: 'Failed to update league country',
        details: awsError instanceof Error ? awsError.message : 'Unknown error'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('💥 Error in league country update proxy:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update league country',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
