import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format a date string for display
 */
export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch {
    return 'Unknown date';
  }
}

/**
 * Format a date string as relative time (e.g., "2 hours ago")
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Unknown date';
  }
}