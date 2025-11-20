import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    await dbConnect();

    const adminEmail = 'admin@skiboh.com';
    const adminPassword = 'password123';

    // Check if admin user exists
    let adminUser = await User.findOne({ email: adminEmail });

    if (adminUser) {
      // Update existing admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      adminUser.password = hashedPassword;
      adminUser.role = 'admin';
      adminUser.banned = false;
      adminUser.businessName = 'Skiboh Admin';
      adminUser.whatsapp = '+2348000000000';
      await adminUser.save();

      return NextResponse.json({
        success: true,
        message: 'Admin user updated successfully',
        data: {
          email: adminUser.email,
          role: adminUser.role,
        },
      });
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      adminUser = await User.create({
        businessName: 'Skiboh Admin',
        email: adminEmail,
        whatsapp: '+2348000000000',
        password: hashedPassword,
        role: 'admin',
        banned: false,
      });

      return NextResponse.json({
        success: true,
        message: 'Admin user created successfully',
        data: {
          email: adminUser.email,
          role: adminUser.role,
        },
      });
    }
  } catch (error) {
    console.error('Create admin error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create/update admin user',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

