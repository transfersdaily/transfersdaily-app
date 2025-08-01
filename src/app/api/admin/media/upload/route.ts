import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://e1si3naehh.execute-api.us-east-1.amazonaws.com/prod';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Processing media upload request');
    
    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const articleId = formData.get('articleId') as string;
    const type = formData.get('type') as string;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    console.log('📁 File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      articleId,
      uploadType: type
    });
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Only image files are allowed' },
        { status: 400 }
      );
    }
    
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }
    
    // Get authorization header from the request
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    console.log('🔐 Auth header present:', !!authHeader);
    
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        error: 'Authorization header is required'
      }, { status: 401 });
    }
    
    // Try to upload to AWS API first
    try {
      console.log('🚀 Attempting upload to AWS API');
      
      const response = await fetch(`${API_BASE_URL}/admin/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader
        },
        body: formData
      });
      
      console.log('📡 AWS upload response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ AWS upload successful:', data);
        return NextResponse.json(data);
      } else {
        const errorText = await response.text();
        console.error('❌ AWS upload failed:', response.status, errorText);
        throw new Error(`AWS upload failed: ${response.status}`);
      }
    } catch (awsError) {
      console.error('💥 AWS upload error:', awsError);
      
      // Return error instead of mock response
      return NextResponse.json({
        success: false,
        error: 'Upload failed - AWS service unavailable',
        details: awsError instanceof Error ? awsError.message : 'Unknown AWS error'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('💥 Error in media upload proxy:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
