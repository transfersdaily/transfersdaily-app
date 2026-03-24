import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';
import { validateAuth } from '@/lib/supabase/auth-guard';

const API_BASE_URL = API_CONFIG.baseUrl;
const API_KEY = process.env.API_GATEWAY_API_KEY || '';

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth();
    if (authError) return authError;

    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'X-User-Id': user!.id,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Stats proxy error:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const raw = await response.json();

    // Transform snake_case Lambda response to camelCase frontend format
    return NextResponse.json({
      totalArticles: parseInt(raw.total_articles || '0'),
      draftArticles: parseInt(raw.drafts || '0'),
      publishedArticles: parseInt(raw.published || '0'),
      totalClubs: parseInt(raw.total_clubs || '0'),
      totalPlayers: parseInt(raw.total_players || '0'),
      totalLeagues: parseInt(raw.total_leagues || '0'),
      createdToday: parseInt(raw.last_24h || '0'),
      createdThisWeek: 0,
      createdThisMonth: 0,
      byCategory: [],
      byLeague: [],
      dailyActivity: [],
    });
  } catch (error) {
    console.error('Stats proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
