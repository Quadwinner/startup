import { NextRequest, NextResponse } from 'next/server';
import { getEvents, getEventById, createEvent, registerForEvent } from '@/lib/supabase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

/**
 * GET events with optional filtering
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const sortBy = searchParams.get('sortBy') || 'date';
    const featured = searchParams.get('featured') === 'true';
    
    // Get events from Supabase with proper filtering
    const events = await getEvents({
      type: type !== 'all' && type !== null ? type : null,
      sortBy,
      featured: featured || undefined
    });
    
    return NextResponse.json({ events });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    
    return NextResponse.json({ 
      events: [], 
      error: 'Error fetching events. Please try again later.' 
    }, { status: 500 });
  }
}

/**
 * POST to create a new event
 */
export async function POST(req: NextRequest) {
  try {
    // Get the user from the session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required to create an event' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const eventData = await req.json();
    
    // Basic validation
    const requiredFields = ['title', 'type', 'description', 'date', 'location'];
    const missingFields = requiredFields.filter(field => !eventData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }
    
    // Add the user ID as the creator
    eventData.creatorId = session.user.id;
    
    // Create event in Supabase
    const event = await createEvent(eventData);
    
    return NextResponse.json(
      { message: 'Event created successfully', event },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating event:', error);
    
    // Handle specific errors
    if (error.code === '23505') { // Unique constraint error
      return NextResponse.json(
        { 
          error: 'An event with this title already exists', 
          details: 'Please use a different event title'
        },
        { status: 400 }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { 
        error: 'Failed to create event. Please try again later.',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH for event registration
 */
export async function PATCH(req: NextRequest) {
  try {
    // Get the user from the session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required to register for an event' },
        { status: 401 }
      );
    }
    
    // Parse the request body to get event ID and registration details
    const { eventId, ...registrationData } = await req.json();
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }
    
    // Add user data to registration
    const userData = {
      userId: session.user.id,
      email: session.user.email,
      ...registrationData
    };
    
    // Register for the event
    const registration = await registerForEvent(eventId, userData);
    
    return NextResponse.json(
      { message: 'Successfully registered for event', registration },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error registering for event:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to register for event. Please try again later.',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
