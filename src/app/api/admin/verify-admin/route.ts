import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();

    const adminEmail = 'admin@skiboh.com';
    const adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      return NextResponse.json({
        success: false,
        message: 'Admin user not found',
      });
    }

    // Test password
    const testPassword = 'password123';
    const passwordMatch = await bcrypt.compare(testPassword, adminUser.password as string);

    return NextResponse.json({
      success: true,
      message: 'Admin user found',
      data: {
        email: adminUser.email,
        businessName: adminUser.businessName,
        role: adminUser.role,
        banned: adminUser.banned,
        passwordMatch,
        hasPassword: !!adminUser.password,
      },
    });
  } catch (error) {
    console.error('Verify admin error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify admin user',
      },
      { status: 500 }
    );
  }
}

