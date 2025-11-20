import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET() {
  const start = Date.now();
  try {
    await dbConnect();
    const end = Date.now();
    return NextResponse.json({ message: 'DB Connected', duration: end - start });
  } catch (error) {
    return NextResponse.json({ error: 'DB Error', details: error }, { status: 500 });
  }
}
