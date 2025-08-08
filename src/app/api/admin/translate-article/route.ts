import { NextRequest, NextResponse } from 'next/server';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

const lambda = new LambdaClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { articleTitle, articleContent, targetLanguage } = await request.json();

    // Validate input
    if (!articleTitle || !articleContent || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required fields: articleTitle, articleContent, or targetLanguage' },
        { status: 400 }
      );
    }

    // Validate supported languages
    const supportedLanguages = ['es', 'fr', 'de', 'it'];
    if (!supportedLanguages.includes(targetLanguage)) {
      return NextResponse.json(
        { error: `Unsupported language: ${targetLanguage}. Supported: ${supportedLanguages.join(', ')}` },
        { status: 400 }
      );
    }

    console.log(`🌍 Generating translation for language: ${targetLanguage}`);

    // Invoke the translation Lambda function
    const command = new InvokeCommand({
      FunctionName: process.env.TRANSLATE_ARTICLE_LAMBDA_NAME || 'translate-article',
      Payload: JSON.stringify({
        articleTitle,
        articleContent,
        targetLanguage
      }),
    });

    const response = await lambda.send(command);
    
    if (!response.Payload) {
      throw new Error('No response from translation Lambda');
    }

    const result = JSON.parse(new TextDecoder().decode(response.Payload));
    
    if (!result.success) {
      console.error('Translation Lambda error:', result.error);
      return NextResponse.json(
        { error: result.error || 'Translation generation failed' },
        { status: 500 }
      );
    }

    console.log(`✅ Translation generated successfully for ${targetLanguage}`);
    
    return NextResponse.json({
      success: true,
      translation: result.translation
    });

  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
