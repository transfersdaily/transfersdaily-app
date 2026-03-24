import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

const API_BASE_URL = API_CONFIG.backendUrl;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/most-searched${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Most searched proxy error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Most searched proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch most searched terms' },
      { status: 500 }
    );
  }
}
