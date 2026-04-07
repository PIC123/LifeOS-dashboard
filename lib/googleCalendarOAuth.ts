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

class GoogleCalendarOAuthService {
  private oauth2Client: any;

  constructor() {
    // Check if OAuth credentials are available
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.warn('Google OAuth credentials not configured');
      this.oauth2Client = null;
      return;
    }

    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`
    );

    // Set credentials if we have them
    if (process.env.GOOGLE_ACCESS_TOKEN && process.env.GOOGLE_REFRESH_TOKEN) {
      this.oauth2Client.setCredentials({
        access_token: process.env.GOOGLE_ACCESS_TOKEN,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      });
    }
  }

  // Get authorization URL for initial setup
  getAuthUrl(): string {
    if (!this.oauth2Client) {
      throw new Error('OAuth client not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
    }

    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events.readonly',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent', // Force refresh token
    });
  }

  // Exchange auth code for tokens
  async getTokens(code: string) {
    if (!this.oauth2Client) {
      throw new Error('OAuth client not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
    }

    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }

  async getEvents(
    calendarId: string = 'primary',
    timeMin?: Date,
    timeMax?: Date,
    maxResults: number = 50
  ): Promise<CalendarEvent[]> {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      const response = await calendar.events.list({
        calendarId,
        timeMin: (timeMin || new Date()).toISOString(),
        timeMax: (timeMax || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).toISOString(),
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
        id: 'mock-oauth-1',
        title: 'OAuth Calendar Integration',
        start: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10 AM today
        end: new Date(today.getTime() + 11 * 60 * 60 * 1000), // 11 AM today
        description: 'Testing OAuth-based calendar access',
        type: 'event',
        color: '#00ffff',
      },
      {
        id: 'mock-oauth-2',
        title: 'Dashboard Testing',
        start: new Date(today.getTime() + 15 * 60 * 60 * 1000), // 3 PM today
        end: new Date(today.getTime() + 16 * 60 * 60 * 1000), // 4 PM today
        description: 'Test the new OAuth calendar integration',
        type: 'event',
        color: '#ff6b35',
      },
    ];
  }
}

export const googleCalendarOAuthService = new GoogleCalendarOAuthService();