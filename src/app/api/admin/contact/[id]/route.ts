import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';
import { validateAuth } from '@/lib/supabase/auth-guard';

const API_BASE_URL = API_CONFIG.baseUrl;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await validateAuth();
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();

    console.log('🔄 Proxying PUT request to AWS API for contact:', id);
    console.log('📦 Request body:', body);

    try {
      const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id
        },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      } else {
        console.error('❌ AWS API PUT error:', response.status);
        const errorText = await response.text();
        console.error('❌ AWS API PUT error details:', errorText);
        throw new Error(`AWS API error: ${response.status}`);
      }
    } catch (awsError) {
      console.error('💥 AWS API PUT failed:', awsError);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to update contact submission',
        details: awsError instanceof Error ? awsError.message : 'Unknown AWS error'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('💥 Error in contact PUT proxy:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update contact submission',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
