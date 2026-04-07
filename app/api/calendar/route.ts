import { NextRequest, NextResponse } from 'next/server';
import { googleCalendarService } from '@/lib/googleCalendar';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeMin = searchParams.get('timeMin') ? new Date(searchParams.get('timeMin')!) : undefined;
    const timeMax = searchParams.get('timeMax') ? new Date(searchParams.get('timeMax')!) : undefined;
    const maxResults = searchParams.get('maxResults') ? parseInt(searchParams.get('maxResults')!) : 50;

    // Fetch events and reminders
    const [events, reminders] = await Promise.all([
      googleCalendarService.getEvents('primary', timeMin, timeMax, maxResults),
      googleCalendarService.getReminders(),
    ]);

    return NextResponse.json({
      events,
      reminders,
      success: true,
    });
  } catch (error) {
    console.error('Calendar API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch calendar data',
        success: false,
      },
      { status: 500 }
    );
  }
}