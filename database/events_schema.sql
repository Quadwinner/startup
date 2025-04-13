-- Events Schema

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS event_tickets;
DROP TABLE IF EXISTS event_registrations;
DROP TABLE IF EXISTS events;

-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  banner_image TEXT,
  image TEXT,
  ticket_price INTEGER DEFAULT 0,
  vip_ticket_price INTEGER DEFAULT 0,
  max_attendees INTEGER,
  organizer TEXT DEFAULT 'Epic Esports',
  is_public BOOLEAN DEFAULT true,
  highlights JSONB,
  schedule JSONB,
  faqs JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create event registrations table
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create event tickets table
CREATE TABLE event_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID NOT NULL REFERENCES event_registrations(id),
  event_id UUID NOT NULL REFERENCES events(id),
  ticket_type TEXT NOT NULL,
  ticket_number TEXT NOT NULL,
  issued_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_tickets_event_id ON event_tickets(event_id);
CREATE INDEX idx_event_tickets_registration_id ON event_tickets(registration_id);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tickets ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to events
CREATE POLICY "Public can view public events" 
ON events FOR SELECT 
USING (is_public = true);

-- For development, allow all operations
-- In production, you should restrict to authenticated users with proper permissions
CREATE POLICY "Anyone can create events" 
ON events FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update events" 
ON events FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can create registrations" 
ON event_registrations FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view registrations" 
ON event_registrations FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create tickets" 
ON event_tickets FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view tickets" 
ON event_tickets FOR SELECT 
USING (true); 