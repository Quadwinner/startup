import { NextResponse } from 'next/server';
import { seedEvents } from '@/lib/supabase';

// Sample events data
const sampleEvents = [
  {
    title: "EpicEsports Collegiate Championship",
    date: "May 15-20, 2023",
    location: "Delhi University, Delhi",
    image: "/images/events/collegiate.jpg",
    type: "tournament",
    description: "A premier collegiate esports tournament bringing together the best teams from universities across India to compete in Valorant and BGMI.",
    ticketPrice: 500,
    vipTicketPrice: 1000,
    maxAttendees: 500,
    organizer: "Epic Esports",
    isPublic: true,
    highlights: [
      "Teams from 20+ universities across India",
      "₹5,00,000 prize pool",
      "Professional casting and streaming",
      "Networking opportunities with esports professionals"
    ],
    schedule: [
      {
        time: "Day 1",
        title: "Opening Ceremony",
        description: "Welcome address and team introductions"
      },
      {
        time: "Day 2-3",
        title: "Group Stage Matches",
        description: "Round-robin format group matches"
      },
      {
        time: "Day 4",
        title: "Quarter Finals",
        description: "Top 8 teams compete in knockout format"
      },
      {
        time: "Day 5",
        title: "Semi Finals",
        description: "Top 4 teams compete for finals spot"
      },
      {
        time: "Day 6",
        title: "Grand Finals",
        description: "Championship match and closing ceremony"
      }
    ],
    faqs: [
      {
        question: "Can I participate if I'm not a college student?",
        answer: "This tournament is exclusively for college and university students. You must have a valid student ID to register."
      },
      {
        question: "Is there a registration fee for participating teams?",
        answer: "Yes, teams need to pay a registration fee of ₹2,000 which covers all team members."
      },
      {
        question: "What games will be featured in the tournament?",
        answer: "The main games for this tournament are Valorant and BGMI (Battlegrounds Mobile India)."
      }
    ]
  },
  {
    title: "Gaming Industry Career Fair",
    date: "June 5, 2023",
    location: "Virtual Event",
    image: "/images/events/career-fair.jpg",
    type: "career",
    description: "Connect with leading gaming companies and esports organizations looking to hire talent across various domains.",
    ticketPrice: 0,
    vipTicketPrice: 0,
    maxAttendees: 1000,
    organizer: "Epic Esports & Game Developers Association",
    isPublic: true,
    highlights: [
      "20+ gaming companies and studios",
      "Portfolio reviews by industry professionals",
      "Resume building workshops",
      "Industry expert panels"
    ],
    schedule: [
      {
        time: "10:00 AM",
        title: "Opening Session",
        description: "Introduction to participating companies"
      },
      {
        time: "11:00 AM",
        title: "Company Presentations",
        description: "Short presentations by hiring companies"
      },
      {
        time: "1:00 PM",
        title: "Networking Break",
        description: "Virtual networking lounge"
      },
      {
        time: "2:00 PM",
        title: "One-on-One Sessions",
        description: "Pre-scheduled interviews and portfolio reviews"
      },
      {
        time: "5:00 PM",
        title: "Closing Panel",
        description: "Future of gaming careers panel discussion"
      }
    ],
    faqs: [
      {
        question: "Is this event only for programmers?",
        answer: "No, companies are hiring for various roles including game design, art, marketing, event management, and community management."
      },
      {
        question: "Do I need to prepare a portfolio?",
        answer: "It's recommended if you're applying for creative or technical roles. You'll have the option to share your portfolio during one-on-one sessions."
      },
      {
        question: "Will there be opportunities for internships?",
        answer: "Yes, many companies will be offering internship positions for students and fresh graduates."
      }
    ]
  },
  {
    title: "Pro Gaming Workshop Series",
    date: "July 10-15, 2023",
    location: "Multiple Cities",
    image: "/images/events/workshop.jpg",
    type: "workshop",
    description: "Learn from professional players and coaches in this intensive workshop series covering game strategy, team coordination, and competitive mindset.",
    ticketPrice: 1500,
    vipTicketPrice: 3000,
    maxAttendees: 100,
    organizer: "Epic Esports Academy",
    isPublic: true,
    highlights: [
      "Training from professional esports players",
      "In-depth game analysis sessions",
      "Mental conditioning workshops",
      "Personalized feedback on gameplay"
    ],
    schedule: [
      {
        time: "Day 1",
        title: "Fundamentals & Mechanics",
        description: "Core gameplay mechanics and skill development"
      },
      {
        time: "Day 2",
        title: "Strategy & Teamwork",
        description: "Team compositions, communication, and strategy"
      },
      {
        time: "Day 3",
        title: "Competitive Mindset",
        description: "Mental fortitude, handling pressure, and consistency"
      },
      {
        time: "Day 4",
        title: "Analysis & Review",
        description: "Game review techniques and self-improvement"
      },
      {
        time: "Day 5",
        title: "Competitive Simulation",
        description: "Mini-tournament with feedback and coaching"
      }
    ],
    faqs: [
      {
        question: "What skill level is required to attend?",
        answer: "The workshops cater to intermediate to advanced players who already understand basic game mechanics."
      },
      {
        question: "What games do the workshops cover?",
        answer: "The series includes separate workshops for Valorant, BGMI, and League of Legends."
      },
      {
        question: "Do I need to bring my own equipment?",
        answer: "For in-person workshops, gaming setups will be provided, but you're welcome to bring your own peripherals (mouse, keyboard, headset)."
      }
    ]
  }
];

export async function GET() {
  try {
    const result = await seedEvents(sampleEvents);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error seeding events:', error);
    return NextResponse.json(
      { error: 'Failed to seed events data' },
      { status: 500 }
    );
  }
} 