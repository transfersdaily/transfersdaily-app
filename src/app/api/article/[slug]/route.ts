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

    // Skip direct slug lookup — all articles have slug=null in DB currently.
    // Go straight to list-based matching.

    // Fetch recent articles and match by generated slug
    const listUrl = `${API_CONFIG.baseUrl}/public/articles?limit=100&status=published&language=${language}&sortBy=published_at&sortOrder=desc`;
    const listResponse = await fetch(listUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(15000),
    });

    if (listResponse.ok) {
      const listData = await listResponse.json();
      const articles = listData.data?.articles || [];

      // Try matching with both new (NFD-normalized) and legacy (no normalization) slugs
      const match = articles.find((a: any) => {
        const title = a.title || '';
        const newSlug = generateSlug(title);
        const oldSlug = generateSlugLegacy(title);
        return newSlug === slug || oldSlug === slug;
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
