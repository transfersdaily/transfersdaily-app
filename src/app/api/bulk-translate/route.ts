import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

const API_BASE_URL = API_CONFIG.baseUrl;

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Frontend API: Starting bulk translation workflow...');
    
    // Parse request body
    const body = await request.json();
    console.log('📥 Frontend received body:', JSON.stringify(body, null, 2));
    
    const { articleIds, targetLanguages } = body;

    // Validate input
    if (!articleIds || !Array.isArray(articleIds) || articleIds.length === 0) {
      console.error('❌ Missing or invalid articleIds:', articleIds);
      return NextResponse.json(
        { success: false, error: 'articleIds must be a non-empty array' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      );
    }

    if (!targetLanguages || !Array.isArray(targetLanguages) || targetLanguages.length === 0) {
      console.error('❌ Missing or invalid targetLanguages:', targetLanguages);
      return NextResponse.json(
        { success: false, error: 'targetLanguages must be a non-empty array' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      );
    }

    console.log(`📡 Fetching article content for ${articleIds.length} articles...`);
    
    // Get Authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      console.error('❌ No Authorization header found');
      return NextResponse.json(
        { success: false, error: 'Missing authorization header' },
        { status: 401 }
      );
    }

    // Fetch article content for each article
    const articlesWithContent = [];
    for (const articleId of articleIds) {
      try {
        const articleResponse = await fetch(`${API_BASE_URL}/admin/articles/${articleId}`, {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          }
        });
        
        if (articleResponse.ok) {
          const articleData = await articleResponse.json();
          if (articleData.success && articleData.data?.article) {
            const article = articleData.data.article;
            articlesWithContent.push({
              articleId,
              articleTitle: article.title,
              articleContent: article.content
            });
          }
        }
      } catch (error) {
        console.error(`Failed to fetch article ${articleId}:`, error);
      }
    }

    if (articlesWithContent.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid articles found' },
        { status: 400 }
      );
    }

    console.log(`📡 Forwarding bulk translation for ${articlesWithContent.length} articles to backend...`);

    // Start translation for each article individually
    const results = [];
    for (const article of articlesWithContent) {
      try {
        const translationResponse = await fetch(`${API_BASE_URL}/admin/start-translation`, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            articleId: article.articleId,
            articleTitle: article.articleTitle,
            articleContent: article.articleContent,
            targetLanguages
          })
        });
        
        const translationData = await translationResponse.json();
        results.push({
          articleId: article.articleId,
          success: translationResponse.ok,
          data: translationData
        });
      } catch (error) {
        results.push({
          articleId: article.articleId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    return NextResponse.json({
      success: true,
      summary: {
        total: articlesWithContent.length,
        started: successful,
        failed: failed,
        results: results
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });



  } catch (error) {
    console.error('💥 Frontend API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
