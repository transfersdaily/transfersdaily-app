import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';
import { validateAuth } from '@/lib/supabase/auth-guard';

const API_BASE_URL = API_CONFIG.baseUrl;
const API_KEY = process.env.API_GATEWAY_API_KEY || '';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await validateAuth();
    if (authError) return authError;

    const { id } = await params;

    const response = await fetch(`${API_BASE_URL}/admin/articles/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'X-User-Id': user!.id,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Article GET proxy error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Wrap raw backend row in the envelope the edit page expects
    // Edit page checks: data.success && data.data?.article
    if (data && !data.success && !data.error) {
      return NextResponse.json({ success: true, data: { article: data } });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Article GET proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await validateAuth();
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/admin/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'X-User-Id': user!.id,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Article PUT proxy error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Wrap raw backend row — edit page checks data.success
    if (data && !data.success && !data.error) {
      return NextResponse.json({ success: true, data: { article: data } });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Article PUT proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await validateAuth();
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();

    // Proxy PATCH to Lambda's /admin/articles/{id}/status endpoint
    const response = await fetch(`${API_BASE_URL}/admin/articles/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'X-User-Id': user!.id,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Article PATCH proxy error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Article PATCH proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update article status' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await validateAuth();
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/admin/articles/${id}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'X-User-Id': user!.id,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Article POST proxy error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Article POST proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to publish article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await validateAuth();
    if (authError) return authError;

    const { id } = await params;

    const response = await fetch(`${API_BASE_URL}/admin/articles/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'X-User-Id': user!.id,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Article DELETE proxy error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Article DELETE proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
