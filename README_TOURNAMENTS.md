# EpicEsports Tournament System

This documentation provides information about the tournament system in EpicEsports India platform.

## Features

- Tournament listing with filtering and sorting
- Tournament details with information about rules, prizes, and schedule
- Player registration for tournaments
- Team-based tournament registration
- Payment integration (currently simulation only)

## Setup Instructions

### 1. Database Setup

The system uses MongoDB for data storage. Make sure your `.env` file contains the correct MongoDB connection string:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/epicesports?retryWrites=true&w=majority
```

### 2. Create Database Indexes

For optimal performance, run the MongoDB index creation commands in `mongodb_setup.js`.

### 3. Seed Initial Data

To seed initial tournament data for testing, make a POST request to the following endpoint:

```
POST /api/seed/tournaments
```

You can use Postman or run the following cURL command:

```
curl -X POST http://localhost:3000/api/seed/tournaments
```

## Tournament Registration Flow

1. Users browse tournaments from the `/tournaments` page
2. To view tournament details, users click on "View Details" which takes them to `/tournaments/[id]`
3. If registration is open, users can click "Register Now"
4. Users will need to be logged in to register. If not logged in, they will be redirected to the login page
5. After logging in, they can fill out the registration form with:
   - Team information
   - Team members details
   - Payment details (if there's a registration fee)
6. Upon successful registration, the user receives a confirmation
7. Tournament organizers can view registrations from the admin panel

## API Endpoints

### Tournaments

- `GET /api/tournaments` - List all tournaments with optional filtering
- `POST /api/tournaments` - Create a new tournament (admin only)
- `GET /api/tournaments/[id]` - Get a single tournament by ID
- `PUT /api/tournaments/[id]` - Update a tournament (admin only)
- `DELETE /api/tournaments/[id]` - Delete a tournament (admin only)

### Registrations

- `POST /api/tournaments/[id]/register` - Register for a tournament
- `GET /api/tournaments/[id]/register` - Get registrations for a tournament (admin only)

## Data Models

### Tournament Model

```typescript
{
  name: string;
  game: string;
  gameImage: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  prizePool: string;
  teamSize: number;
  maxTeams: number;
  currentTeams: number;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  description: string;
  rules: string;
  prizes: {
    position: number;
    reward: string;
  }[];
  schedule: {
    stage: string;
    date: Date;
    details: string;
  }[];
  organizer: {
    name: string;
    verified: boolean;
    contact: string;
  };
  registrationFee: number;
  featured: boolean;
  streamLink?: string;
}
```

### Registration Model

```typescript
{
  tournamentId: ObjectId;
  teamName: string;
  teamLeader: {
    name: string;
    email: string;
    phone: string;
    gameId: string;
  };
  members: {
    name: string;
    email: string;
    gameId: string;
  }[];
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: 'upi' | 'card' | 'free' | 'other';
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string;
  agreedToTerms: boolean;
  userId: ObjectId;
}
```

## Troubleshooting

### Navigation Issues

If you encounter navigation issues with the tournament registration system:

1. Make sure you're signed in before attempting to register
2. Check browser console for any JavaScript errors
3. Verify that your MongoDB connection is working properly
4. Check the server logs for any API endpoint errors

### Empty Tournament List

If the tournament list is empty:

1. Make sure you've seeded the database with initial data
2. Check the network tab in developer tools to see if the API request is succeeding
3. Verify that your MongoDB connection is correct
4. Try clearing your browser cache and reloading the page 