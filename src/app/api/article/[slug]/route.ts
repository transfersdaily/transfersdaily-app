import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';
import { generateSlug } from '@/lib/constants';

// Generate slug WITHOUT diacritics normalization (old format for backward compat)
function generateSlugLegacy(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
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

    // Try direct slug lookup first (slugs are populated in DB)
    const directUrl = `${API_CONFIG.baseUrl}/public/articles/${encodeURIComponent(slug)}?language=${language}`;
    const directResponse = await fetch(directUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10000),
    });

    if (directResponse.ok) {
      const directData = await directResponse.json();
      const article = directData.data?.article || directData.article;
      if (article) {
        return NextResponse.json({
          success: true,
          data: { article },
        });
      }
    }

    // Fallback: fetch recent articles and match by generated slug (for legacy links)
    const listUrl = `${API_CONFIG.baseUrl}/public/articles?limit=100&status=published&language=${language}&sortBy=published_at&sortOrder=desc`;
    const listResponse = await fetch(listUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10000),
    });

    if (listResponse.ok) {
      const listData = await listResponse.json();
      const articles = listData.data?.articles || [];

      const match = articles.find((a: any) => {
        const title = a.title || '';
        return generateSlug(title) === slug || generateSlugLegacy(title) === slug;
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
