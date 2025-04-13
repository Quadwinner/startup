-- Epic Esports Events Table Setup
-- Run this in the Supabase SQL Editor to set up your events table

-- First, drop existing table if it exists
DROP TABLE IF EXISTS events;

-- Create the events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  end_date TEXT,
  location TEXT NOT NULL,
  image TEXT,
  banner_image TEXT,
  ticket_price INTEGER,
  vip_ticket_price INTEGER,
  registration_deadline TEXT,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  organizer JSONB,
  highlights JSONB,
  schedule JSONB,
  faqs JSONB,
  is_public BOOLEAN DEFAULT true,
  creator_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on events table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
-- For events table
CREATE POLICY "Allow public read access on events" 
ON events FOR SELECT 
USING (true);

CREATE POLICY "Allow creators to update their events" 
ON events FOR UPDATE 
USING (auth.uid() = creator_id)
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Allow creators to insert events" 
ON events FOR INSERT 
WITH CHECK (auth.uid() = creator_id OR auth.uid() IN (
  SELECT user_id FROM user_profiles WHERE role = 'admin'
));

-- Create an event_registrations table to track attendees
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_type TEXT DEFAULT 'standard',
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable Row Level Security on event_registrations table
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
CREATE POLICY "Allow users to view their own registrations" 
ON event_registrations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to register for events" 
ON event_registrations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to increment event attendee count when a user registers
CREATE OR REPLACE FUNCTION increment_event_attendees(event_id UUID)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE events
  SET current_attendees = current_attendees + 1
  WHERE id = event_id;
END;
$$;

-- Create trigger to automatically call the function after an insertion
CREATE TRIGGER after_registration_insert
AFTER INSERT ON event_registrations
FOR EACH ROW
EXECUTE FUNCTION increment_event_attendees(NEW.event_id);

-- Create indexes for better performance
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);

-- Sample comment explaining the tables
COMMENT ON TABLE events IS 'Stores event information for the EpicEsports platform';
COMMENT ON TABLE event_registrations IS 'Tracks user registrations for events';
