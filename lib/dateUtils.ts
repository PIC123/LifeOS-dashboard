/**
 * Utility functions for safe date handling in the LifeOS Dashboard
 */

/**
 * Safely converts a date-like value to a Date object
 * @param dateValue - Could be a Date object, ISO string, or other date representation
 * @returns Date object or null if conversion fails
 */
export function safeToDate(dateValue: unknown): Date | null {
  if (!dateValue) return null;
  
  // If it's already a Date object, return it
  if (dateValue instanceof Date) {
    return dateValue;
  }
  
  // If it's a string or number, try to parse it
  if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  
  return null;
}

/**
 * Safely calls toISOString on a date-like value
 * @param dateValue - Could be a Date object, ISO string, or other date representation
 * @returns ISO string or null if conversion fails
 */
export function safeToISOString(dateValue: unknown): string | null {
  const date = safeToDate(dateValue);
  return date ? date.toISOString() : null;
}

/**
 * Safely gets date string in YYYY-MM-DD format
 * @param dateValue - Could be a Date object, ISO string, or other date representation
 * @returns Date string in YYYY-MM-DD format or null if conversion fails
 */
export function safeDateString(dateValue: unknown): string | null {
  const isoString = safeToISOString(dateValue);
  return isoString ? isoString.split('T')[0] : null;
}

/**
 * Safely formats time from a date-like value
 * @param dateValue - Could be a Date object, ISO string, or other date representation
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted time string or null if conversion fails
 */
export function safeFormatTime(
  dateValue: unknown, 
  options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false }
): string | null {
  const date = safeToDate(dateValue);
  return date ? date.toLocaleTimeString([], options) : null;
}

/**
 * Runtime type guard for CalendarEvent with proper date validation
 * @param event - Object to validate
 * @returns True if event has valid start and end dates
 */
export function isValidCalendarEvent(event: any): event is { start: Date; end: Date; [key: string]: any } {
  return (
    event &&
    typeof event === 'object' &&
    safeToDate(event.start) !== null &&
    safeToDate(event.end) !== null
  );
}

/**
 * Normalizes CalendarEvent dates to ensure they're Date objects
 * @param event - CalendarEvent that might have string dates
 * @returns CalendarEvent with proper Date objects
 */
export function normalizeCalendarEvent(event: any): any {
  const startDate = safeToDate(event.start);
  const endDate = safeToDate(event.end);
  
  if (!startDate || !endDate) {
    console.warn('Invalid dates in calendar event:', event);
    return null;
  }
  
  return {
    ...event,
    start: startDate,
    end: endDate,
  };
}