import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/lib/googleCalendar';

interface CalendarData {
  events: CalendarEvent[];
  reminders: CalendarEvent[];
  loading: boolean;
  error: string | null;
}

interface UseCalendarOptions {
  timeMin?: Date;
  timeMax?: Date;
  maxResults?: number;
  refreshInterval?: number; // in milliseconds
}

export function useCalendar({
  timeMin,
  timeMax,
  maxResults = 50,
  refreshInterval = 5 * 60 * 1000, // 5 minutes default
}: UseCalendarOptions = {}): CalendarData {
  const [data, setData] = useState<CalendarData>({
    events: [],
    reminders: [],
    loading: true,
    error: null,
  });

  const fetchCalendarData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      const params = new URLSearchParams();
      if (timeMin) params.append('timeMin', timeMin.toISOString());
      if (timeMax) params.append('timeMax', timeMax.toISOString());
      if (maxResults) params.append('maxResults', maxResults.toString());

      const response = await fetch(`/api/calendar?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Ensure all event dates are proper Date objects
        const processEvents = (events: any[]) => 
          events.map(event => {
            try {
              return {
                ...event,
                start: event.start instanceof Date ? event.start : new Date(event.start),
                end: event.end instanceof Date ? event.end : new Date(event.end),
              };
            } catch (error) {
              console.warn('Invalid date in event:', event);
              return {
                ...event,
                start: new Date(),
                end: new Date(),
              };
            }
          });

        setData({
          events: processEvents(result.events || []),
          reminders: processEvents(result.reminders || []),
          loading: false,
          error: null,
        });
      } else {
        throw new Error(result.error || 'Failed to fetch calendar data');
      }
    } catch (error) {
      console.error('Calendar fetch error:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  useEffect(() => {
    fetchCalendarData();

    // Set up refresh interval if specified
    if (refreshInterval > 0) {
      const interval = setInterval(fetchCalendarData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [timeMin, timeMax, maxResults, refreshInterval]);

  return data;
}