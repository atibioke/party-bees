import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { getNextOccurrence } from '@/lib/recurringEvents';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Auth check
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    
    // Generate slug if not provided
    if (!body.slug && body.title) {
      const generateSlug = (title: string): string => {
        return title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
          .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      };
      
      const baseSlug = generateSlug(body.title);
      let slug = baseSlug;
      let counter = 1;
      
      // Check for existing slug and make it unique
      while (await Event.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      body.slug = slug;
    }
    
    // Assign hostId from token - ensure it's a string
    const hostId = typeof payload.userId === 'string' 
      ? payload.userId 
      : String(payload.userId);
    const event = await Event.create({ ...body, hostId });
    
    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create event' }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const state = searchParams.get('state');
    const lga = searchParams.get('lga');
    const hostId = searchParams.get('hostId');
    const includePast = searchParams.get('includePast') === 'true'; // Allow admins/hosts to see past events
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const skip = (page - 1) * limit;
    
    const query: Record<string, unknown> = {};
    if (state) query.state = state;
    if (lga) query.lga = lga;
    if (hostId) query.hostId = hostId;
    
    // Filter out past events unless explicitly requested
    // We'll handle recurring events separately after fetching
    if (!includePast) {
      const now = new Date();
      // For now, include all recurring events and events that haven't ended
      // We'll process recurring events after fetching to calculate next occurrence
      query.$or = [
        { endDateTime: { $gte: now } }, // Non-past one-time events
        { isRecurring: true } // Include all recurring events, we'll filter them below
      ];
    }

    // Get total count for pagination (approximate, since recurring events need special handling)
    const total = await Event.countDocuments(query);
    
    // Get paginated events
    const events = await Event.find(query)
      .sort({ startDateTime: 1 })
      .skip(skip)
      .limit(limit);
    
    // Process recurring events: update dates to next occurrence if current one has passed
    const now = new Date();
    const processedEvents = events.map((event) => {
      const eventObj = event.toObject();
      
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
          // No more occurrences, mark for exclusion
          return null;
        }
      }
      
      // Filter out events that have ended (after processing recurring events)
      if (!includePast && eventObj.endDateTime < now) {
        return null;
      }
      
      return eventObj;
    }).filter(event => event !== null); // Remove null events
    
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({ 
      success: true, 
      data: processedEvents,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}
