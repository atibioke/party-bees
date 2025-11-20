import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { getNextOccurrence } from '@/lib/recurringEvents';

export async function GET() {
  try {
    await dbConnect();

    // Get featured/trending events - prioritize featured events, then upcoming events sorted by date, limit to 6
    const now = new Date();
    const featuredEvents = await Event.find({
      $or: [
        { endDateTime: { $gte: now } }, // Non-past one-time events
        { isRecurring: true } // Include all recurring events
      ]
    })
      .sort({ featured: -1, startDateTime: 1 }) // Sort by featured first (featured events first), then by start date
      .limit(12) // Get more to account for filtering
      .select('title slug startDateTime endDateTime state lga address host flyer isPaid price labels isRecurring recurringPattern recurrenceInterval recurrenceEndType recurrenceEndDate recurrenceCount featured')
      .lean();

    // Process recurring events: update dates to next occurrence if current one has passed
    const processedEvents = featuredEvents
      .map((event) => {
        const eventObj = { ...event };
        
        // If it's a recurring event and the current occurrence has passed
        if (eventObj.isRecurring && eventObj.endDateTime < now) {
          const nextOccurrence = getNextOccurrence(
            eventObj.startDateTime,
            eventObj.endDateTime,
            eventObj.recurringPattern || 'weekly',
            eventObj.recurrenceInterval || 1,
            eventObj.recurrenceEndType || 'never',
            eventObj.recurrenceEndDate,
            eventObj.recurrenceCount
          );
          
          // If there's a next occurrence, update the dates
          if (nextOccurrence) {
            eventObj.startDateTime = nextOccurrence.nextStartDate;
            eventObj.endDateTime = nextOccurrence.nextEndDate;
          } else {
            // No more occurrences, exclude this event
            return null;
          }
        }
        
        // Filter out events that have ended (after processing recurring events)
        if (eventObj.endDateTime < now) {
          return null;
        }
        
        return eventObj;
      })
      .filter(event => event !== null) // Remove null events
      .slice(0, 6); // Take only the first 6

    return NextResponse.json({
      success: true,
      data: processedEvents.map(event => ({
        ...event,
        id: event._id.toString(),
        _id: event._id.toString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured events' },
      { status: 500 }
    );
  }
}

