# EpicEsports India - Competitive Gaming Platform

EpicEsports India is a comprehensive platform for competitive gaming in India, designed to connect gamers, colleges, and industry stakeholders in a vibrant online ecosystem. The platform facilitates tournaments, community building, and performance tracking for esports enthusiasts.

## Features

- **User Authentication**: Secure registration and login system
- **Game Categories**: Browse various game categories including Valorant, BGMI, and more
- **Tournament System**: View, register, and participate in upcoming tournaments
- **Community Features**: Connect with other gamers and teams
- **Performance Tracking**: Track player and team statistics
- **Career Opportunities**: Browse and apply for positions in the esports industry
- **Responsive Design**: Mobile-friendly interface for all devices
- **Admin Dashboard**: Manage tournaments and player profiles

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB or Supabase
- **Authentication**: JWT, bcrypt for password hashing
- **Deployment**: Vercel (recommended)

## Setup Instructions

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- A Supabase account (for database)

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/epicesports-production.git
   cd epicesports-production
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Update the variables with your own values

4. Set up Supabase Database:
   - Create a new Supabase project at https://supabase.com
   - Get your project URL and anon key from the API settings
   - Add these to your `.env.local` file
   - Create the `tournaments` table in Supabase with the following SQL:

```sql
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  game TEXT NOT NULL,
  gameImage TEXT,
  startDate TEXT NOT NULL,
  endDate TEXT NOT NULL,
  registrationDeadline TEXT NOT NULL,
  prizePool TEXT NOT NULL,
  teamSize INTEGER NOT NULL,
  maxTeams INTEGER NOT NULL,
  currentTeams INTEGER DEFAULT 0,
  location TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  registrationFee INTEGER DEFAULT 0,
  format TEXT,
  description TEXT,
  rules TEXT,
  organizer JSONB,
  prizes JSONB,
  schedule JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row-level security
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" 
ON tournaments FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" 
ON tournaments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow owners to update" 
ON tournaments FOR UPDATE USING (
  auth.uid() = (organizer->>'id')::uuid
);
```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Seed the database with sample tournaments:
   - Visit http://localhost:3000/api/seed/tournaments in your browser

### Setting Up Authentication

1. In your Supabase dashboard, go to Authentication > Providers
2. Enable Email/Password provider
3. Configure Google OAuth if desired

## Project Structure

```
epicesports-production/
├── public/             # Static assets
│   └── images/         # Image assets
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── api/        # API routes
│   │   ├── pages/      # Page routes
│   │   ├── layout.tsx  # Root layout
│   │   └── page.tsx    # Home page
│   ├── components/     # Reusable components
│   ├── lib/            # Utilities and shared code
│   └── backend/        # Backend services
└── README.md           # Project documentation
```

## API Routes

- **POST /api/register**: User registration
- **POST /api/login**: User authentication
- **GET /api/tournaments**: Get tournament listings
- **GET /api/games**: Get game categories
- **POST /api/tournaments/register**: Register for tournaments

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact:
- Email: shubhamkush012@gmail.com
- Phone: 8824013820

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Vercel](https://vercel.com/)

## Troubleshooting

If you encounter database connection issues:
1. Check your Supabase URL and API key
2. Ensure your IP is allowed in Supabase
3. Check database policies for proper access control

## Setting Up User Profiles and Member Dashboard with Real-Time Data

Follow these steps to set up the user profile and member dashboard with real-time data instead of mock data:

### 1. Create Database Tables

Run the following SQL scripts in your Supabase SQL Editor:

1. First create the user profiles table:
   ```sql
   -- Run the content of src/sql/user_profiles_table.sql
   ```

2. Create the member stats table:
   ```sql
   -- Run the content of src/sql/member_stats_table.sql
   ```

3. Create the tournament registrations table:
   ```sql
   -- Run the content of src/sql/tournaments_registrations_table.sql
   ```

### 2. Seed Initial Data

After setting up the tables, you can seed initial data for testing:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Log in to your account

3. Visit the seed endpoint in your browser or use a tool like Postman:
   ```
   POST /api/seed/profile
   ```

   Or simply navigate to: http://localhost:3000/api/seed/profile

### 3. Access Your Profile Data

Once the data is seeded, you can access your profile and member dashboard with real-time data at:

- **Dashboard**: http://localhost:3000/dashboard
- **Profile**: http://localhost:3000/profile/[your-username]
- **Account**: http://localhost:3000/account

### 4. Troubleshooting

If you're still seeing mock data instead of real data from the database:

1. Check the console logs for any errors related to database connections
2. Verify that your Supabase environment variables are correctly set in `.env.local`
3. Ensure that your user account is authenticated
4. Try refreshing the page or signing out and back in
