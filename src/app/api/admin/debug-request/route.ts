import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Request method:', request.method);
    console.log('🔍 DEBUG: Request URL:', request.url);
    
    // Log all headers
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = key.toLowerCase() === 'authorization' ? 'Bearer [REDACTED]' : value;
    });
    console.log('🔍 DEBUG: Request headers:', headers);
    
    // Log body
    const body = await request.json();
    console.log('🔍 DEBUG: Request body:', JSON.stringify(body, null, 2));
    
    return NextResponse.json({
      success: true,
      debug: {
        method: request.method,
        headers,
        body,
        contentType: request.headers.get('content-type'),
        authorization: request.headers.get('authorization') ? 'Present' : 'Missing'
      }
    });
    
  } catch (error) {
    console.error('🔍 DEBUG: Error parsing request:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}
