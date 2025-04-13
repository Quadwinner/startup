-- Epic Esports Registrations Setup Script
-- This script handles both the registrations table and tournament_registrations table

-- First, check if the tables exist and only drop if needed
DO $$
BEGIN
    -- Create a function to increment tournament team count
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'increment_tournament_teams') THEN
        CREATE FUNCTION increment_tournament_teams(tournament_id UUID)
        RETURNS void LANGUAGE plpgsql AS $$
        BEGIN
          UPDATE tournaments
          SET current_teams = current_teams + 1
          WHERE id = tournament_id;
        END;
        $$;
    END IF;

    -- Setup for registrations table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'registrations') THEN
        -- Table exists, add missing columns if needed
        BEGIN
            ALTER TABLE registrations 
                ADD COLUMN IF NOT EXISTS team_members JSONB DEFAULT '[]'::jsonb,
                ADD COLUMN IF NOT EXISTS captain JSONB DEFAULT '{}'::jsonb,
                ADD COLUMN IF NOT EXISTS contact_info JSONB DEFAULT '{}'::jsonb,
                ADD COLUMN IF NOT EXISTS payment_method TEXT,
                ADD COLUMN IF NOT EXISTS transaction_id TEXT,
                ADD COLUMN IF NOT EXISTS payment_details JSONB DEFAULT '{}'::jsonb,
                ADD COLUMN IF NOT EXISTS agreed_to_terms BOOLEAN DEFAULT false,
                ADD COLUMN IF NOT EXISTS is_checked_in BOOLEAN DEFAULT false,
                ADD COLUMN IF NOT EXISTS check_in_time TIMESTAMP WITH TIME ZONE;
            
            -- Update constraint if possible
            ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_payment_status_check;
            ALTER TABLE registrations ADD CONSTRAINT registrations_payment_status_check 
                CHECK (payment_status IN ('unpaid', 'pending', 'free', 'paid', 'refunded', 'failed'));
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not modify registrations table: %', SQLERRM;
        END;
    ELSE
        -- Create the registrations table if it doesn't exist
        CREATE TABLE registrations (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
            user_id TEXT NOT NULL,
            team_name TEXT NOT NULL,
            team_members JSONB NOT NULL,
            captain JSONB NOT NULL,
            contact_info JSONB,
            registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
            status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
            payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'free', 'paid', 'refunded', 'failed')),
            payment_method TEXT,
            transaction_id TEXT,
            payment_details JSONB DEFAULT '{}'::jsonb,
            agreed_to_terms BOOLEAN DEFAULT false,
            notes TEXT,
            is_checked_in BOOLEAN DEFAULT false,
            check_in_time TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
    END IF;

    -- Create indexes on the registrations table
    CREATE INDEX IF NOT EXISTS idx_registrations_tournament_id ON registrations(tournament_id);
    CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
    CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
    CREATE INDEX IF NOT EXISTS idx_registrations_payment_status ON registrations(payment_status);

    -- Enable Row Level Security
    ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

    -- Create policies for Row Level Security (drop first to ensure no duplicates)
    DROP POLICY IF EXISTS "Allow public read access on registrations" ON registrations;
    CREATE POLICY "Allow public read access on registrations" 
        ON registrations FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Allow all inserts on registrations for development" ON registrations;
    CREATE POLICY "Allow all inserts on registrations for development" 
        ON registrations FOR INSERT WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow users to update their own registrations" ON registrations;
    CREATE POLICY "Allow users to update their own registrations" 
        ON registrations FOR UPDATE USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);
END;
$$;

-- Success message
SELECT 'Registration tables and functions have been successfully configured.' AS result; 