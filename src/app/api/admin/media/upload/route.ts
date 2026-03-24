import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';
import { validateAuth } from '@/lib/supabase/auth-guard';

const API_BASE_URL = API_CONFIG.baseUrl;
const API_KEY = process.env.API_GATEWAY_API_KEY || '';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per D-11
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth();
    if (authError) return authError;

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type per D-11
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Invalid file type: ${file.type}. Accepted: JPEG, PNG, WebP, GIF` },
        { status: 400 }
      );
    }

    // Validate file size per D-11
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to binary Buffer — this is the critical fix
    // Previously sent FormData directly which API Gateway cannot handle
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Send as raw binary with the file's actual content type
    // API Gateway with binaryMediaTypes will base64-encode this for Lambda
    const response = await fetch(`${API_BASE_URL}/admin/media/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': file.type, // e.g., 'image/jpeg' — NOT multipart/form-data
        'x-api-key': API_KEY,
        'X-User-Id': user.id,
      },
      body: fileBuffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Media upload error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: `Upload failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Lambda returns { url, key, bucket } — pass through
    return NextResponse.json({
      success: true,
      url: data.url,
      key: data.key,
    });
  } catch (error) {
    console.error('Media upload proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
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
