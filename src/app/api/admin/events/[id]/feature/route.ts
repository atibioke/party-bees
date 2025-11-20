import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import User from '@/models/User';

// Helper function to check admin role
async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return { isAdmin: false, error: 'Not authenticated' };
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    return { isAdmin: false, error: 'Invalid token' };
  }

  await dbConnect();
  const userId = typeof payload.userId === 'string' 
    ? payload.userId 
    : String(payload.userId);
  
  const user = await User.findById(userId).select('role');
  
  if (!user || user.role !== 'admin') {
    return { isAdmin: false, error: 'Unauthorized - Admin access required' };
  }

  return { isAdmin: true };
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { success: false, error: adminCheck.error },
        { status: 403 }
      );
    }

    await dbConnect();
    const { featured } = await req.json();
    const eventId = params.id;

    const event = await Event.findByIdAndUpdate(
      eventId,
      { featured: featured === true },
      { new: true }
    );

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: event,
      message: event.featured ? 'Event featured successfully' : 'Event unfeatured successfully',
    });
  } catch (error) {
    console.error('Feature event error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

