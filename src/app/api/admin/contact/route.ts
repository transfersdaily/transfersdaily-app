import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';
import { validateAuth } from '@/lib/supabase/auth-guard';

const API_BASE_URL = API_CONFIG.baseUrl;

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth();
    if (authError) return authError;

    // Forward query params from the request
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/contact${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': user!.id,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Contact proxy error:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const raw = await response.json();

    // Transform Lambda response to frontend expected format
    // Lambda returns: { items: [...], total: 42 }
    // Frontend expects: { success: true, data: { submissions: [...], pagination: { total, page, limit, totalPages } } }
    const total = raw.total || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        submissions: raw.items || [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Contact proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact submissions' },
      { status: 500 }
    );
  }
}
