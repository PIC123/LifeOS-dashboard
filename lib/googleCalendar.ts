import { google } from 'googleapis';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  type: 'event' | 'reminder' | 'habit';
  color?: string;
}

class GoogleCalendarService {
  private calendar: any;

  constructor() {
    // Initialize Google Calendar API only if credentials are available
    if (process.env.GOOGLE_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_ID) {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
      });

      this.calendar = google.calendar({ version: 'v3', auth });
    } else {
      // No credentials available, calendar will be null
      this.calendar = null;
    }
  }

  async getEvents(
    calendarId: string = 'primary',
    timeMin?: Date,
    timeMax?: Date,
    maxResults: number = 50
  ): Promise<CalendarEvent[]> {
    // Check if credentials are available
    if (!this.calendar || (!process.env.GOOGLE_CLIENT_EMAIL && !process.env.GOOGLE_CLIENT_ID)) {
      console.warn('Google Calendar credentials not configured, using mock data');
      return this.getMockEvents();
    }

    try {
      const response = await this.calendar.events.list({
        calendarId,
        timeMin: (timeMin || new Date()).toISOString(),
        timeMax: (timeMax || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).toISOString(), // Default 7 days
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];

      return events.map((event: any): CalendarEvent => ({
        id: event.id || '',
        title: event.summary || 'Untitled Event',
        start: new Date(event.start?.dateTime || event.start?.date || ''),
        end: new Date(event.end?.dateTime || event.end?.date || ''),
        description: event.description || undefined,
        type: 'event',
        color: this.getEventColor(event.colorId || undefined),
      }));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      // Return mock data for development
      return this.getMockEvents();
    }
  }

  private getEventColor(colorId?: string | null): string {
    // Map Google Calendar color IDs to our retro theme colors
    const colorMap: Record<string, string> = {
      '1': '#00ffff', // cyan
      '2': '#ff6b35', // orange
      '3': '#ffaa00', // amber
      '4': '#ff6b35', // orange variant
      '5': '#00ffff', // cyan variant
    };
    
    return colorMap[colorId || '1'] || '#00ffff';
  }

  private getMockEvents(): CalendarEvent[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return [
      {
        id: 'mock-1',
        title: 'Daily Standup',
        start: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9 AM today
        end: new Date(today.getTime() + 9.5 * 60 * 60 * 1000), // 9:30 AM today
        description: 'Team sync meeting',
        type: 'event',
        color: '#00ffff',
      },
      {
        id: 'mock-2',
        title: 'Work on LifeOS Dashboard',
        start: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 2 PM today
        end: new Date(today.getTime() + 16 * 60 * 60 * 1000), // 4 PM today
        description: 'Continue building the calendar integration',
        type: 'event',
        color: '#ff6b35',
      },
      {
        id: 'mock-3',
        title: 'Review code changes',
        start: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // 10 AM tomorrow
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000), // 11 AM tomorrow
        description: 'PR review session',
        type: 'event',
        color: '#ffaa00',
      },
    ];
  }

  // Method to get reminders (could be from Google Tasks API or other source)
  async getReminders(): Promise<CalendarEvent[]> {
    // For now, return mock reminders
    // In the future, this could integrate with Google Tasks API
    const now = new Date();
    
    return [
      {
        id: 'reminder-1',
        title: 'Check on Pi 5 order',
        start: now,
        end: now,
        description: 'Follow up on Raspberry Pi delivery',
        type: 'reminder',
        color: '#ffaa00',
      },
      {
        id: 'reminder-2', 
        title: 'Schedule dentist appointment',
        start: now,
        end: now,
        description: 'Book routine cleaning',
        type: 'reminder',
        color: '#ff6b35',
      },
    ];
  }
}

export const googleCalendarService = new GoogleCalendarService();