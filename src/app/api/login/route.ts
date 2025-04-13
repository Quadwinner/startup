import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';

// Define login input schema for validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate login data
    const validationResult = loginSchema.safeParse(body);
    
    if (!validationResult.success) {
      // Return validation errors
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid login credentials',
          errors: validationResult.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      );
    }
    
    // Extract validated data
    const { email, password } = validationResult.data;
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');
    
    // Find the user by email
    const user = await users.findOne({ email });
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email or password' 
        }, 
        { status: 401 }
      );
    }
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email or password' 
        }, 
        { status: 401 }
      );
    }
    
    // Get JWT secret from environment variable
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    
    // Create JWT token
    const token = jwt.sign(
      { 
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
        gamertag: user.gamertag
      },
      jwtSecret,
      { expiresIn: '7d' }
    );
    
    // Set cookie with token
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        gamertag: user.gamertag,
        role: user.role
      }
    }, { status: 200 });
    
    // Set secure HTTP-only cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error during login' 
      }, 
      { status: 500 }
    );
  }
} 