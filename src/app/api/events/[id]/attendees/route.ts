import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Attendee from '@/models/Attendee';
import Event from '@/models/Event';
import mongoose from 'mongoose';

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
      phone,
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
