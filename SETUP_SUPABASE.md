# Supabase Setup Guide for EpicEsports

This guide will walk you through setting up Supabase for the EpicEsports platform.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com) if you don't have one
2. Create a new project in Supabase
3. Get familiar with the Supabase dashboard

## Step 1: Configure Environment Variables

1. Copy the `.env.local.example` file to `.env.local`
2. Update the following variables in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

You can find these values in your Supabase project under Project Settings > API.

## Step 2: Set Up the Database

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the entire SQL script from `setup_database.sql` in the project root
3. Paste it into the SQL Editor and run it
4. This will create the following tables:
   - `tournaments`
   - `players`
   - `tournament_registrations`

## Step 3: Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Under Email Auth, make sure "Enable Email Signup" is turned on
3. Optionally, configure additional providers like Google OAuth

### Setting Up Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Set up OAuth credentials
4. Configure the authorized redirect URI as: `https://your-supabase-project.supabase.co/auth/v1/callback`
5. Copy the Client ID and Client Secret to the Supabase dashboard under Authentication > Providers > Google

## Step 4: Initialize the Database with Sample Data

After setting up your Supabase project and running the application:

1. Start the development server with `npm run dev`
2. Visit the following endpoints to seed your database with sample data:
   - `http://localhost:3000/api/seed/tournaments`
   - `http://localhost:3000/api/seed/players`

## Step 5: Test Authentication

1. Navigate to the login page in your application
2. Test login with both email/password and Google authentication
3. Verify that users are properly redirected after authentication

## Troubleshooting

### Authentication Issues

- Check that your Supabase URL and keys are correct in `.env.local`
- Ensure the Supabase project has Email Auth enabled
- Check browser console for specific error messages

### Database Connection Issues

- Verify that tables were created correctly in the Supabase dashboard
- Check if Row Level Security (RLS) policies are preventing operations
- For development, you can temporarily disable RLS for specific tables

### API Errors

- Look for error messages in the server console and browser console
- Verify that your service role key has the necessary permissions
- Check the Supabase dashboard for usage limits and rate limiting

## Additional Resources

- [Supabase Documentation](https://supabase.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Next.js Documentation](https://nextjs.org/docs) 