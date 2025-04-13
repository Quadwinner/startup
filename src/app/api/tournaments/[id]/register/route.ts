import { NextRequest, NextResponse } from 'next/server';
import { getTournamentById } from '@/lib/supabase';
import { createRegistration, getRegistrations } from '@/lib/supabase-registrations';
import { validateRegistration } from '@/lib/validation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

/**
 * @swagger
 * /api/tournaments/{id}/register:
 *   post:
 *     description: Register for a tournament
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamName
 *               - teamMembers
 *               - captain
 *               - contactInfo
 *             properties:
 *               teamName:
 *                 type: string
 *               teamMembers:
 *                 type: array
 *               captain:
 *                 type: object
 *               contactInfo:
 *                 type: object
 *     responses:
 *       201:
 *         description: Registration created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Tournament not found
 *       409:
 *         description: Already registered or tournament full
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get authenticated user from NextAuth session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const tournamentId = params.id;
    const body = await req.json();
    
    // Extract registration details
    const { teamName, teamMembers, captain, contactInfo } = body;
    
    // Use authenticated user ID from NextAuth session
    const userId = session.user.id || session.user.email;
    
    // Validate required fields
    if (!userId || !teamName || !teamMembers || !captain || !contactInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if tournament exists
    const tournament = await getTournamentById(tournamentId);
    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }
    
    // Check if tournament is open for registration
    if (tournament.status !== 'upcoming') {
      return NextResponse.json(
        { error: 'Tournament is not open for registration' },
        { status: 400 }
      );
    }
    
    // Check if tournament is full
    if (tournament.currentTeams >= tournament.maxTeams) {
      return NextResponse.json(
        { error: 'Tournament is full' },
        { status: 409 }
      );
    }
    
    // Check if user has already registered
    const existingRegistrations = await getRegistrations(tournamentId, userId);
    if (existingRegistrations.length > 0) {
      return NextResponse.json(
        { error: 'You have already registered for this tournament' },
        { status: 409 }
      );
    }
    
    // Create registration
    const registrationData = {
      tournamentId,
      userId,
      teamName,
      teamMembers,
      captain,
      contactInfo,
      status: 'pending', // Default status
      paymentStatus: 'unpaid' // Valid value that works with the Supabase schema
    };
    
    // Validate registration data
    const validationError = validateRegistration(registrationData);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }
    
    const registration = await createRegistration(registrationData);
    
    return NextResponse.json(
      { message: 'Registration successful', registration },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error registering for tournament:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to register for tournament' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/tournaments/{id}/register:
 *   get:
 *     description: Get all registrations for a tournament
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of registrations
 *       404:
 *         description: Tournament not found
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get authenticated user from NextAuth session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const tournamentId = params.id;
    const userId = session.user.id || session.user.email;
    
    // Check if tournament exists
    const tournament = await getTournamentById(tournamentId);
    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }
    
    // Get registrations
    const registrations = await getRegistrations(tournamentId, userId);
    
    return NextResponse.json({ registrations });
  } catch (error: any) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
} 