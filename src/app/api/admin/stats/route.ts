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
  dayName: string;
  fullDate: string;
}

async function fetchChartData(statusFilter?: string): Promise<{
  byCategory: ChartEntry[];
  byLeague: ChartEntry[];
  dailyActivity: DailyActivityEntry[];
  byStatus: ChartEntry[];
  createdToday: number;
  createdThisWeek: number;
  createdThisMonth: number;
}> {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // For published articles, use published_at for time-based queries
  const dateColumn = statusFilter === 'published' ? 'published_at' : 'created_at';

  // Build base queries with optional status filter
  function withStatus(query: any) {
    return statusFilter ? query.eq('status', statusFilter) : query;
  }

  const [
    { data: categoryData },
    { data: leagueData },
    { data: dailyData },
    { count: todayCount },
    { count: weekCount },
    { count: monthCount },
    { data: statusData },
  ] = await Promise.all([
    withStatus(
      supabaseAdmin
        .from('articles')
        .select('category')
        .not('category', 'is', null)
    ),
    withStatus(
      supabaseAdmin
        .from('articles')
        .select('league')
        .not('league', 'is', null)
    ),
    withStatus(
      supabaseAdmin
        .from('articles')
        .select(`${dateColumn}, transfer_status`)
        .gte(dateColumn, weekAgo)
    ),
    withStatus(
      supabaseAdmin
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .gte(dateColumn, todayStart.toISOString())
    ),
    withStatus(
      supabaseAdmin
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .gte(dateColumn, weekAgo)
    ),
    withStatus(
      supabaseAdmin
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .gte(dateColumn, monthAgo)
    ),
    // Transfer status breakdown (for byStatus chart)
    withStatus(
      supabaseAdmin
        .from('articles')
        .select('transfer_status')
        .not('transfer_status', 'is', null)
    ),
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

  // Aggregate dailyActivity from raw rows using the correct date column
  const dailyCounts: Record<string, number> = {};
  for (const row of dailyData || []) {
    const dateValue = (row as Record<string, string>)[dateColumn];
    const date = dateValue?.substring(0, 10) || '';
    if (date) {
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    }
  }

  // Gap-fill the last 7 days so the chart always shows all days
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    if (!(key in dailyCounts)) dailyCounts[key] = 0;
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyActivity: DailyActivityEntry[] = Object.entries(dailyCounts)
    .map(([date, count]) => {
      const d = new Date(date + 'T00:00:00');
      return {
        date,
        count,
        dayName: dayNames[d.getDay()],
        fullDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  // Aggregate byStatus (transfer_status breakdown)
  const STATUS_COLORS: Record<string, string> = {
    rumour: '#f59e0b',
    confirmed: '#22c55e',
    completed: '#3b82f6',
    loan: '#a855f7',
    contract: '#8b5cf6',
  };
  const statusCounts: Record<string, number> = {};
  for (const row of statusData || []) {
    const ts = row.transfer_status || 'unknown';
    statusCounts[ts] = (statusCounts[ts] || 0) + 1;
  }
  const byStatus: ChartEntry[] = Object.entries(statusCounts)
    .map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] || '#6b7280' }))
    .sort((a, b) => b.value - a.value);

  return {
    byCategory,
    byLeague,
    dailyActivity,
    byStatus,
    createdToday: todayCount ?? 0,
    createdThisWeek: weekCount ?? 0,
    createdThisMonth: monthCount ?? 0,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth();
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') || undefined;

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
      fetchChartData(statusFilter),
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
      createdToday: chartData.createdToday,
      createdThisWeek: chartData.createdThisWeek,
      createdThisMonth: chartData.createdThisMonth,
      byCategory: chartData.byCategory,
      byLeague: chartData.byLeague,
      dailyActivity: chartData.dailyActivity,
      byStatus: chartData.byStatus,
    });
  } catch (error) {
    console.error('Stats proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
