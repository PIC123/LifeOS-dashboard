import { NextRequest, NextResponse } from 'next/server';
import { zettelkastenService } from '@/lib/zettelkasten';

export async function GET(request: NextRequest) {
  try {
    console.log('Zettelkasten API called');

    const searchParams = request.nextUrl.searchParams;
    const view = searchParams.get('view') || 'overview';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const query = searchParams.get('query');

    let result = {};

    switch (view) {
      case 'overview':
        const [recentNotes, maps, inbox] = await Promise.all([
          zettelkastenService.getAtomicNotes(10),
          zettelkastenService.getKnowledgeMaps(),
          zettelkastenService.getInboxItems(),
        ]);
        
        result = {
          recentNotes,
          maps,
          inbox: inbox.slice(0, 5), // Limit inbox items
          stats: {
            totalNotes: recentNotes.length,
            totalMaps: maps.length,
            inboxCount: inbox.length,
          }
        };
        break;

      case 'notes':
        if (query) {
          result = { notes: await zettelkastenService.searchNotes(query) };
        } else {
          result = { notes: await zettelkastenService.getAtomicNotes(limit) };
        }
        break;

      case 'maps':
        result = { maps: await zettelkastenService.getKnowledgeMaps() };
        break;

      case 'recent':
        const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 7;
        result = { notes: await zettelkastenService.getRecentActivity(days) };
        break;

      case 'inbox':
        result = { inbox: await zettelkastenService.getInboxItems() };
        break;

      default:
        throw new Error(`Unknown view: ${view}`);
    }

    console.log('Zettelkasten data fetched successfully:', { view, resultKeys: Object.keys(result) });

    return NextResponse.json({
      ...result,
      success: true,
    });
  } catch (error) {
    console.error('Zettelkasten API error:', error);
    
    // Return 200 with empty data to prevent dashboard blocking
    return NextResponse.json(
      { 
        error: 'Failed to fetch zettelkasten data',
        success: false,
        debug: error instanceof Error ? error.message : 'Unknown error',
        recentNotes: [],
        maps: [],
        inbox: [],
        stats: { totalNotes: 0, totalMaps: 0, inboxCount: 0 }
      },
      { status: 200 }
    );
  }
}