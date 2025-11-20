import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { validateNigerianPhone } from '@/utils/phone';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Event identifier is required' }, { status: 400 });
    }
    
    // Try to find by slug first
    let event = await Event.findOne({ slug: id });
    
    if (!event) {
      // If not found by slug, try MongoDB ObjectId
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        event = await Event.findById(id);
      }
    }
    
    if (!event) {
      console.log(`Event not found for identifier: ${id}`);
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error('Get event error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    
    // Try to find by slug first, then by ID
    let event = await Event.findOne({ slug: id });
    if (!event && id.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(id);
    }
    
    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }
    
    // Validate organizer phone number if provided
    if (body.organizerPhone) {
      const phoneValidation = validateNigerianPhone(body.organizerPhone);
      if (!phoneValidation.isValid) {
        return NextResponse.json(
          { success: false, error: phoneValidation.error || 'Invalid phone number' },
          { status: 400 }
        );
      }
      body.organizerPhone = phoneValidation.formatted;
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(event._id, body, {
      new: true,
      runValidators: true,
    });
    
    return NextResponse.json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error('Update event error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    // Try to find by slug first, then by ID
    let event = await Event.findOne({ slug: id });
    if (!event && id.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(id);
    }
    
    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }
    
    await Event.deleteOne({ _id: event._id });
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Delete event error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}
