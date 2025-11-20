import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Connect to database
    await dbConnect();
    
    // Get connection state
    const state = mongoose.connection.readyState;
    const stateMap: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    
    // Perform a ping to verify the connection is actually working
    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
    }
    
    // Get connection details
    const connectionInfo = {
      state: stateMap[state] || 'unknown',
      readyState: state,
      databaseName: mongoose.connection.db?.databaseName || 'unknown',
      host: mongoose.connection.host || 'unknown',
      port: mongoose.connection.port || 'unknown',
      isConnected: mongoose.connection.readyState === 1,
    };
    
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connection verified successfully',
      connection: connectionInfo,
      ping: 'successful'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to connect to database',
      details: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 });
  }
}
