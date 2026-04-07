import { NextRequest, NextResponse } from 'next/server';
import { conversationMemoryService } from '@/lib/conversationMemory';

export async function GET(request: NextRequest) {
  try {
    console.log('Memory API called');

    const searchParams = request.nextUrl.searchParams;
    const view = searchParams.get('view') || 'overview';
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : undefined;
    const query = searchParams.get('query');

    let result = {};

    switch (view) {
      case 'overview':
        const [recentMemories, insights, stats, longTermMemory] = await Promise.all([
          conversationMemoryService.getDailyMemories(7),
          conversationMemoryService.getConversationInsights(7),
          conversationMemoryService.getMemoryStats(),
          conversationMemoryService.getLongTermMemory(),
        ]);
        
        result = {
          recentMemories,
          insights: insights.slice(0, 10),
          stats,
          longTermMemory: longTermMemory ? longTermMemory.substring(0, 500) + '...' : null,
        };
        break;

      case 'daily':
        result = { 
          memories: await conversationMemoryService.getDailyMemories(days || 30) 
        };
        break;

      case 'insights':
        result = { 
          insights: await conversationMemoryService.getConversationInsights(days || 14) 
        };
        break;

      case 'search':
        if (!query) {
          throw new Error('Search query is required');
        }
        result = { 
          results: await conversationMemoryService.searchConversations(query, days || 90) 
        };
        break;

      case 'stats':
        result = { 
          stats: await conversationMemoryService.getMemoryStats() 
        };
        break;

      case 'long-term':
        result = { 
          longTermMemory: await conversationMemoryService.getLongTermMemory() 
        };
        break;

      default:
        throw new Error(`Unknown view: ${view}`);
    }

    console.log('Memory data fetched successfully:', { view, resultKeys: Object.keys(result) });

    return NextResponse.json({
      ...result,
      success: true,
    });
  } catch (error) {
    console.error('Memory API error:', error);
    
    // Return 200 with empty data to prevent dashboard blocking
    return NextResponse.json(
      { 
        error: 'Failed to fetch memory data',
        success: false,
        debug: error instanceof Error ? error.message : 'Unknown error',
        recentMemories: [],
        insights: [],
        stats: { totalDays: 0, totalInsights: 0, recentActivity: 0, topTopics: [] },
      },
      { status: 200 }
    );
  }
}