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

export async function GET(req: Request) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { success: false, error: adminCheck.error },
        { status: 403 }
      );
    }

    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;
    const search = searchParams.get('search') || '';
    const featured = searchParams.get('featured');

    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { host: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { lga: { $regex: search, $options: 'i' } },
      ];
    }
    if (featured === 'true') {
      query.featured = true;
    } else if (featured === 'false') {
      query.featured = false;
    }

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('hostId', 'businessName email banned')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin events error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

