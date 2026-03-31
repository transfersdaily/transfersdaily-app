import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';
import { validateAuth } from '@/lib/supabase/auth-guard';

const API_BASE_URL = API_CONFIG.baseUrl;
const API_KEY = process.env.API_GATEWAY_API_KEY || '';

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth();
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/admin/players${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'X-User-Id': user!.id,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Players list proxy error:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const raw = await response.json();

    return NextResponse.json({
      success: true,
      players: raw.players || [],
      pagination: {
        page: raw.pagination?.page || 1,
        limit: raw.pagination?.limit || 20,
        total: raw.pagination?.total || 0,
        totalPages: raw.pagination?.totalPages || 1,
      },
    });
  } catch (error) {
    console.error('Players list proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch players' },
      { status: 500 }
    );
  }
}
