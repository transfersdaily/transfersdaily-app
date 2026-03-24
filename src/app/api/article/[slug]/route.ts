import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'en';

    if (!API_CONFIG.baseUrl) {
      return NextResponse.json(
        { success: false, error: 'API configuration missing' },
        { status: 500 }
      );
    }

    // Try direct slug/UUID lookup first
    const directUrl = `${API_CONFIG.baseUrl}/public/articles/${slug}?language=${language}`;
    const directResponse = await fetch(directUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10000),
    });

    if (directResponse.ok) {
      const data = await directResponse.json();
      if (data.success && data.data?.article) {
        return NextResponse.json(data);
      }
    }

    // Fallback: fetch recent articles and match by generated slug
    // This handles articles where slug is null in the DB
    const listUrl = `${API_CONFIG.baseUrl}/public/articles?limit=50&status=published&language=${language}&sortBy=published_at&sortOrder=desc`;
    const listResponse = await fetch(listUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10000),
    });

    if (listResponse.ok) {
      const listData = await listResponse.json();
      const articles = listData.data?.articles || [];

      const match = articles.find((a: any) => {
        const articleSlug = generateSlug(a.title || '');
        return articleSlug === slug;
      });

      if (match) {
        return NextResponse.json({
          success: true,
          data: { article: match },
        });
      }
    }

    return NextResponse.json(
      { success: false, error: 'Article not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Article proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}
