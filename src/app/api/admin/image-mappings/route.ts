import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateAuth } from '@/lib/supabase/auth-guard'

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth()
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const league = searchParams.get('league')

    let query = supabaseAdmin
      .from('club_image_mappings')
      .select('*', { count: 'exact' })
      .order('league', { ascending: true })
      .order('club_name', { ascending: true })

    if (search) {
      query = query.ilike('club_name', `%${search}%`)
    }

    if (league) {
      query = query.eq('league', league)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch image mappings' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      mappings: data || [],
      total: count || 0,
    })
  } catch (error) {
    console.error('Image mappings GET error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch image mappings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth()
    if (authError) return authError

    const body = await request.json()

    const {
      club_name,
      club_name_variants,
      league,
      domain,
      news_url,
      image_css_selector,
      fallback_css_selector,
      crest_url,
      jersey_url,
    } = body

    // Validate required fields
    if (!club_name || !league || !domain || !news_url || !image_css_selector) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: club_name, league, domain, news_url, image_css_selector',
        },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('club_image_mappings')
      .insert({
        club_name,
        club_name_variants: club_name_variants || [],
        league,
        domain,
        news_url,
        image_css_selector,
        fallback_css_selector: fallback_css_selector || null,
        crest_url: crest_url || null,
        jersey_url: jersey_url || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create image mapping' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, mapping: data }, { status: 201 })
  } catch (error) {
    console.error('Image mappings POST error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create image mapping',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth()
    if (authError) return authError

    const body = await request.json()

    const { id, ...updateFields } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: id' },
        { status: 400 }
      )
    }

    // Remove fields that should not be updated directly
    delete updateFields.created_at

    // Always set updated_at
    updateFields.updated_at = new Date().toISOString()

    const { data, error } = await supabaseAdmin
      .from('club_image_mappings')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update image mapping' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Image mapping not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, mapping: data })
  } catch (error) {
    console.error('Image mappings PUT error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update image mapping',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
