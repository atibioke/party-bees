/**
 * Utility functions for handling recurring events
 */

/**
 * Calculate the next occurrence of a recurring event
 * @param originalStartDate - The original start date of the recurring event
 * @param originalEndDate - The original end date of the recurring event
 * @param pattern - The recurring pattern (daily, weekly, monthly, yearly)
 * @param interval - How often it repeats (e.g., every 2 weeks, default: 1)
 * @param endType - How recurrence ends: 'never', 'after', or 'on'
 * @param recurrenceEndDate - End date (if endType is 'on')
 * @param recurrenceCount - Number of occurrences (if endType is 'after')
 * @param occurrenceNumber - Current occurrence number (for 'after' end type)
 * @returns Object with nextStartDate and nextEndDate, or null if no more occurrences
 */
export function getNextOccurrence(
  originalStartDate: Date,
  originalEndDate: Date,
  pattern: string,
  interval: number = 1,
  endType: 'never' | 'after' | 'on' = 'never',
  recurrenceEndDate?: Date | null,
  recurrenceCount?: number | null,
  occurrenceNumber: number = 1
): { nextStartDate: Date; nextEndDate: Date; occurrenceNumber: number } | null {
  const now = new Date();

  // Check end conditions
  if (endType === 'on' && recurrenceEndDate && recurrenceEndDate < now) {
    return null; // Recurrence has ended
  }

  if (endType === 'after' && recurrenceCount && occurrenceNumber >= recurrenceCount) {
    return null; // Reached max occurrences
  }

  let currentStart = new Date(originalStartDate);
  let currentEnd = new Date(originalEndDate);
  let currentOccurrence = occurrenceNumber;

  // Keep calculating next occurrences until we find one in the future
  while (currentEnd < now) {
    const nextStart = new Date(currentStart);
    const nextEnd = new Date(currentEnd);

    // Calculate next occurrence based on pattern and interval
    switch (pattern) {
      case 'daily':
        nextStart.setDate(nextStart.getDate() + interval);
        nextEnd.setDate(nextEnd.getDate() + interval);
        break;
      case 'weekly':
        nextStart.setDate(nextStart.getDate() + (7 * interval));
        nextEnd.setDate(nextEnd.getDate() + (7 * interval));
        break;
      case 'monthly':
        nextStart.setMonth(nextStart.getMonth() + interval);
        nextEnd.setMonth(nextEnd.getMonth() + interval);
        break;
      case 'yearly':
        nextStart.setFullYear(nextStart.getFullYear() + interval);
        nextEnd.setFullYear(nextEnd.getFullYear() + interval);
        break;
      default:
        return null; // Unknown pattern
    }

    currentOccurrence++;

    // Check if we've exceeded end conditions
    if (endType === 'on' && recurrenceEndDate && nextStart > recurrenceEndDate) {
      return null;
    }

    if (endType === 'after' && recurrenceCount && currentOccurrence > recurrenceCount) {
      return null;
    }

    currentStart = nextStart;
    currentEnd = nextEnd;
  }

  return {
    nextStartDate: currentStart,
    nextEndDate: currentEnd,
    occurrenceNumber: currentOccurrence,
  };
}

/**
 * Check if a recurring event has any future occurrences
 */
export function hasFutureOccurrences(
  originalEndDate: Date,
  pattern: string,
  recurrenceEndDate?: Date | null
): boolean {
  const now = new Date();

  // If recurrence has an end date and it's passed, no future occurrences
  if (recurrenceEndDate && recurrenceEndDate < now) {
    return false;
  }

  // If the original end date is in the future, there's at least one occurrence
  if (originalEndDate >= now) {
    return true;
  }

  // Calculate if there's a next occurrence
  const nextOccurrence = getNextOccurrence(
    originalEndDate, // Use end date as reference
    originalEndDate,
    pattern,
    1, // interval
    recurrenceEndDate ? 'on' : 'never', // endType
    recurrenceEndDate || undefined
  );

  return nextOccurrence !== null;
}

