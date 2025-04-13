# Database Setup for User Profiles and Member Dashboard

This directory contains SQL scripts to set up the necessary database tables for the user profile and member dashboard features in the Epic Esports platform.

## Tables Structure

### 1. User Profiles Table (`user_profiles_table.sql`)
Stores detailed information about users beyond the basic auth data:
- Profile details (username, display name, bio)
- Location information (country, state, city)
- Gaming preferences (main game, experience level)
- Profile images (avatar, banner)
- Social links

### 2. Member Stats Table (`member_stats_table.sql`)
Tracks player performance statistics and achievements:
- Tournament participation (total tournaments, wins)
- Match statistics (matches played, win rate)
- Game-specific stats (kills, deaths, assists, K/D ratio)
- Achievements and badges

### 3. Tournament Registrations Table (`tournaments_registrations_table.sql`)
Records all tournament registrations by players/teams:
- Registration details (team name, members)
- Status tracking (registration status, payment status)
- Check-in information

## Setup Instructions

1. **Access your Supabase project SQL Editor**:
   - Log in to the Supabase dashboard
   - Navigate to the SQL Editor section

2. **Run the SQL scripts in the following order**:
   ```
   1. user_profiles_table.sql
   2. member_stats_table.sql
   3. tournaments_registrations_table.sql
   ```

3. **Verify table creation**:
   - Go to the "Table Editor" section in Supabase
   - You should see the new tables listed

## Integration with Authentication

These tables are designed to work with Supabase's built-in auth system:
- The `user_id` column in each table references `auth.users(id)`
- Row-level security policies are configured to protect user data
- Public/private access is properly configured

## Development Notes

- During development, you can use the mock data provided in the API endpoints while setting up these tables
- Once tables are created, the application will automatically start using real data from the database
- If you encounter foreign key errors, ensure that the referenced tables (e.g., `tournaments`) exist first

## Troubleshooting

If you encounter errors:

1. **Foreign Key Constraints**: Make sure the referenced tables exist before creating these tables
2. **Permission Issues**: Verify that your Supabase API keys have appropriate permissions
3. **Table Already Exists**: The scripts use `IF NOT EXISTS` so they're safe to run multiple times 