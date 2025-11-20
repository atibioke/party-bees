import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await dbConnect();

    // Fetch event by slug to get organizer phone
    const event = await Event.findOne({ slug: id });
    
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    if (!event.organizerPhone) {
      return NextResponse.json(
        { success: false, error: 'Organizer contact not available' },
        { status: 404 }
      );
    }

    // Clean phone number (remove any non-digit characters except +)
    const cleanPhone = event.organizerPhone.replace(/[^\d+]/g, '');
    
    // If it doesn't start with +, assume it's a Nigerian number and add country code
    const whatsappNumber = cleanPhone.startsWith('+') 
      ? cleanPhone 
      : `+234${cleanPhone.replace(/^0/, '')}`;
    
    // Remove + for WhatsApp URL
    const phoneForUrl = whatsappNumber.replace(/\+/g, '');
    
    // Create prefilled message
    const message = `Hi! I'm interested in attending *${event.title}*. Can you provide more details about ${event.isPaid ? 'tickets' : 'entry'}?`;
    const encodedMessage = encodeURIComponent(message);
    
    // Generate WhatsApp link
    const whatsappUrl = `https://wa.me/${phoneForUrl}?text=${encodedMessage}`;
    
    // Log analytics (optional - you could track this in database)
    console.log(`WhatsApp contact initiated for event: ${event.title} (${event.slug})`);
    
    // Redirect to WhatsApp
    return NextResponse.redirect(whatsappUrl, 307);
  } catch (error) {
    console.error('Contact organizer error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
