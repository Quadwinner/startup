import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hash } from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, gamertag, primaryGame, bio } = await req.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await hash(password, 12);
    
    // Set role based on email for development testing
    const role = email.includes('admin') ? 'admin' : 'member';
    
    // Insert user into MongoDB
    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date()
    });
    
    // Create player profile
    if (gamertag) {
      await db.collection('players').insertOne({
        userId: result.insertedId,
        username: gamertag,
        displayName: name,
        mainGame: primaryGame || null,
        email,
        bio: bio || null,
        winRate: 0,
        totalMatches: 0,
        wins: 0,
        losses: 0,
        createdAt: new Date()
      });
    }

    // Return success response without exposing sensitive data
    return NextResponse.json(
      { 
        message: 'User registered successfully',
        userId: result.insertedId.toString()
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 