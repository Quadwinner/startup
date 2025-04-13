# Tournament Registration Setup Guide

This guide will help you set up and troubleshoot the tournament registration system in your EpicEsports platform.

## Setup Steps

### 1. Set up the Database Tables

First, you need to run the SQL script to set up the registrations table:

1. Log into your Supabase dashboard at https://supabase.com
2. Navigate to your project
3. Go to the SQL Editor
4. Copy and paste the contents of `SQL/setup_registrations.sql` into the editor
5. Run the SQL script

The script is designed to:
- Create the `registrations` table if it doesn't exist
- Add any missing columns if the table already exists
- Set up Row Level Security policies
- Create required indexes
- Create the `increment_tournament_teams` function

### 2. Verify Your Environment Variables

Make sure your `.env.local` file contains the correct Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Restart Your Development Server

Restart your Next.js development server to ensure all changes are loaded:

```bash
# In PowerShell
cd epicesports-production
npm run dev
```

### 4. Seed Test Data (Optional)

If you want to test the registration system with sample data:

1. Make sure you have tournaments in your database (visit `/api/seed/tournaments` if not)
2. Visit the URL: `http://localhost:3000/api/seed/registrations` in your browser

## Troubleshooting

### Common Error: 400 Bad Request

If you're receiving a 400 error when registering for tournaments:

1. **Check Your Console:** Look for detailed error messages in the browser console
2. **Verify Table Schema:** Make sure the registrations table in Supabase has all required columns
3. **Check Data Format:** Ensure team members, captain, and contact info are properly formatted as JSON

### Row Level Security Issues

If you get errors related to Row Level Security:

1. Go to the SQL Editor in Supabase
2. Run the following SQL for development:
```sql
-- CAUTION: For development only, not for production!
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
```

### Fixing Specific Errors

#### "Column not found" errors

If you see errors about columns not found, you may need to add these columns:

```sql
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS [column_name] [data_type];
```

#### Increment Function Not Working

If the tournament team count isn't increasing after registration:

```sql
-- Check if the function exists
SELECT * FROM pg_proc WHERE proname = 'increment_tournament_teams';

-- Recreate if needed
CREATE OR REPLACE FUNCTION increment_tournament_teams(tournament_id UUID)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE tournaments
  SET current_teams = current_teams + 1
  WHERE id = tournament_id;
END;
$$;
```

## Registration Flow

The registration process follows these steps:

1. User fills out the registration form (TournamentRegistrationForm.tsx)
2. Form data is submitted to `/api/tournaments/[id]/register` endpoint
3. API endpoint validates data through validation.ts
4. If valid, registration is created in Supabase via `supabase-registrations.ts`
5. Tournament team count is incremented

## Data Structure

The registration data should have this structure:

```typescript
{
  tournamentId: string;    // UUID of the tournament
  userId: string;          // User ID or email
  teamName: string;        // Name of the team
  teamMembers: {           // Array of team members (excluding captain)
    name: string;
    email: string;
    gameId: string;
  }[];
  captain: {               // Team captain details
    name: string;
    email: string;
    phone: string;
    gameId: string;
  };
  contactInfo: {           // Team contact information
    email: string;
    phone: string;
  };
  paymentStatus: string;   // Status of payment (unpaid, pending, free, paid)
  paymentMethod: string;   // Method of payment (upi, card, etc.)
  transactionId: string;   // Transaction ID for payment
  agreedToTerms: boolean;  // Whether user agreed to terms
}
```

## Customizing the Registration Form

If you need to customize the registration form, edit `src/components/TournamentRegistrationForm.tsx`.

## Getting Help

If you continue to experience issues, please check:
- Browser console logs
- Server logs
- Supabase database logs from your dashboard

Feel free to reach out for support at shubhamkush012@gmail.com. 