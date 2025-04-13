# Epic Esports Events System Setup

This guide will help you set up the events management system for the Epic Esports platform.

## Prerequisites

- Supabase project set up with credentials in your `.env.local` file
- Node.js and npm installed

## Setup Steps

### 1. Create Database Tables

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `database/events_schema.sql` and execute it in the SQL Editor
4. This will create three tables:
   - `events` - Stores event information
   - `event_registrations` - Stores user registrations for events
   - `event_tickets` - Stores tickets for registered users

### 2. Configure Environment Variables

Make sure your `.env.local` file contains the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Seed Initial Event Data

1. Start your development server:
   ```
   npm run dev
   ```

2. Open a browser and visit:
   ```
   http://localhost:3000/api/seed/events
   ```

3. You should see a success message indicating that the initial event data has been seeded.

## Feature Overview

### 1. Events Listing
- Browse all events on the `/events` page
- Filter events by type (tournament, workshop, etc.)

### 2. Event Details
- View detailed information about an event on `/events/[id]`
- See schedule, FAQs, and other event information
- Register for events and get tickets

### 3. Event Creation
- Create new events via the `/events/create` page
- Set event details, pricing, and attendance limits

## Database Schema

### Events Table
| Column           | Type      | Description                           |
|------------------|-----------|---------------------------------------|
| id               | UUID      | Primary key                           |
| title            | TEXT      | Event title                           |
| type             | TEXT      | Event type (tournament, workshop, etc.) |
| date             | TEXT      | Event date(s)                         |
| location         | TEXT      | Event location                        |
| description      | TEXT      | Event description                     |
| banner_image     | TEXT      | URL to banner image                   |
| image            | TEXT      | URL to card image                     |
| ticket_price     | INTEGER   | Standard ticket price                 |
| vip_ticket_price | INTEGER   | VIP ticket price                      |
| max_attendees    | INTEGER   | Maximum attendees limit               |
| organizer        | TEXT      | Event organizer                       |
| is_public        | BOOLEAN   | Whether event is publicly visible     |
| highlights       | JSONB     | Array of event highlights             |
| schedule         | JSONB     | Event schedule details                |
| faqs             | JSONB     | Frequently asked questions            |
| created_at       | TIMESTAMP | Creation timestamp                    |

### Event Registrations Table
| Column           | Type      | Description                           |
|------------------|-----------|---------------------------------------|
| id               | UUID      | Primary key                           |
| event_id         | UUID      | Reference to events table             |
| name             | TEXT      | Registrant's name                     |
| email            | TEXT      | Registrant's email                    |
| phone            | TEXT      | Registrant's phone number             |
| registration_date| TIMESTAMP | Registration date                     |
| status           | TEXT      | Registration status                   |
| created_at       | TIMESTAMP | Creation timestamp                    |

### Event Tickets Table
| Column           | Type      | Description                           |
|------------------|-----------|---------------------------------------|
| id               | UUID      | Primary key                           |
| registration_id  | UUID      | Reference to event_registrations table|
| event_id         | UUID      | Reference to events table             |
| ticket_type      | TEXT      | Ticket type (standard, VIP)           |
| ticket_number    | TEXT      | Unique ticket identifier              |
| issued_date      | TIMESTAMP | Date ticket was issued                |
| status           | TEXT      | Ticket status                         |
| created_at       | TIMESTAMP | Creation timestamp                    |

## Troubleshooting

### Images Not Displaying
Ensure that the image paths in your events data are correct. The default paths are:
- `/images/events-bg.jpg` - Default events background
- `/images/events/[image-name].jpg` - Event card images

### Registration Not Working
Check the following:
1. Supabase Row Level Security (RLS) policies
2. Network requests in the browser console
3. Server logs for any errors

### SQL Errors
If you encounter SQL errors when setting up the tables:
1. Make sure you're running the SQL script in the correct order
2. Check for any existing tables with the same names
3. Verify that your Supabase project has the uuid-ossp extension enabled 