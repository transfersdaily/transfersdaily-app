import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { API_CONFIG } from '@/lib/config';
import { validateAuth } from '@/lib/supabase/auth-guard';

const API_BASE_URL = API_CONFIG.baseUrl;
const API_KEY = process.env.API_GATEWAY_API_KEY || '';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ChartEntry {
  name: string;
  value: number;
}

interface DailyActivityEntry {
  date: string;
  count: number;
}

async function fetchChartData(): Promise<{
  byCategory: ChartEntry[];
  byLeague: ChartEntry[];
  dailyActivity: DailyActivityEntry[];
  createdThisWeek: number;
  createdThisMonth: number;
}> {
  const [
    { data: categoryData },
    { data: leagueData },
    { data: dailyData },
    { count: weekCount },
    { count: monthCount },
  ] = await Promise.all([
    supabaseAdmin
      .from('articles')
      .select('category')
      .not('category', 'is', null),
    supabaseAdmin
      .from('articles')
      .select('league')
      .not('league', 'is', null),
    supabaseAdmin
      .from('articles')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabaseAdmin
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabaseAdmin
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  // Aggregate byCategory from raw rows
  const categoryCounts: Record<string, number> = {};
  for (const row of categoryData || []) {
    const cat = row.category || 'uncategorized';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }
  const byCategory: ChartEntry[] = Object.entries(categoryCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Aggregate byLeague from raw rows
  const leagueCounts: Record<string, number> = {};
  for (const row of leagueData || []) {
    const league = row.league || 'unknown';
    leagueCounts[league] = (leagueCounts[league] || 0) + 1;
  }
  const byLeague: ChartEntry[] = Object.entries(leagueCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Aggregate dailyActivity from raw rows
  const dailyCounts: Record<string, number> = {};
  for (const row of dailyData || []) {
    const date = row.created_at?.substring(0, 10) || '';
    if (date) {
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    }
  }
  const dailyActivity: DailyActivityEntry[] = Object.entries(dailyCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    byCategory,
    byLeague,
    dailyActivity,
    createdThisWeek: weekCount ?? 0,
    createdThisMonth: monthCount ?? 0,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth();
    if (authError) return authError;

    // Fetch Lambda stats and Supabase chart data in parallel
    const [lambdaResponse, chartData] = await Promise.all([
      fetch(`${API_BASE_URL}/admin/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'X-User-Id': user!.id,
        },
      }),
      fetchChartData(),
    ]);

    if (!lambdaResponse.ok) {
      const errorText = await lambdaResponse.text();
      console.error('Stats proxy error:', lambdaResponse.status, errorText);
      throw new Error(`API error: ${lambdaResponse.status}`);
    }

    const raw = await lambdaResponse.json();

    // Transform snake_case Lambda response to camelCase frontend format
    // and merge with Supabase chart data
    return NextResponse.json({
      totalArticles: parseInt(raw.total_articles || '0'),
      draftArticles: parseInt(raw.drafts || '0'),
      publishedArticles: parseInt(raw.published || '0'),
      totalClubs: parseInt(raw.total_clubs || '0'),
      totalPlayers: parseInt(raw.total_players || '0'),
      totalLeagues: parseInt(raw.total_leagues || '0'),
      createdToday: parseInt(raw.last_24h || '0'),
      createdThisWeek: chartData.createdThisWeek,
      createdThisMonth: chartData.createdThisMonth,
      byCategory: chartData.byCategory,
      byLeague: chartData.byLeague,
      dailyActivity: chartData.dailyActivity,
    });
  } catch (error) {
    console.error('Stats proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
