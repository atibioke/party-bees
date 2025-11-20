import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Attendee from '@/models/Attendee';
import Event from '@/models/Event';
import { getSession } from '@/lib/auth';
import { validateNigerianPhone } from '@/utils/phone';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Verify user is authenticated
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find event by slug or ID
    let event = await Event.findOne({ slug: id });
    if (!event && id.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(id);
    }

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Verify user is the event organizer
    if (event.hostId.toString() !== session.user.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - You can only view attendees for your own events' },
        { status: 403 }
      );
    }

    // Fetch all attendees for this event
    const attendees = await Attendee.find({ eventId: event._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: attendees,
      count: attendees.length,
    });
  } catch (error) {
    console.error('Get attendees error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, phone, email, acceptedTerms } = await req.json();

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name and phone number are required' },
        { status: 400 }
      );
    }

    // Validate Nigerian phone number
    const phoneValidation = validateNigerianPhone(phone);
    if (!phoneValidation.isValid) {
      return NextResponse.json(
        { success: false, error: phoneValidation.error || 'Invalid phone number' },
        { status: 400 }
      );
    }

    if (!acceptedTerms) {
      return NextResponse.json(
        { success: false, error: 'You must accept the terms and conditions' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify event exists
    const event = await Event.findOne({ slug: id });
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Create attendee record
    const attendee = await Attendee.create({
      name,
      phone: phoneValidation.formatted!,
      email: email || undefined,
      eventId: event._id,
      acceptedTerms: true,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: attendee._id,
        message: 'Interest registered successfully!',
      },
    });
  } catch (error) {
    console.error('Save attendee error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
