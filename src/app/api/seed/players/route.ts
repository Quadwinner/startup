import { NextRequest, NextResponse } from 'next/server';
import { seedPlayers } from '@/lib/supabase';

// Sample players data for seeding
const samplePlayers = [
  {
    username: 'ninja',
    displayName: 'Ninja',
    mainGame: 'Fortnite',
    profileImage: 'https://res.cloudinary.com/dxm7nytrd/image/upload/v1650123456/players/ninja.jpg',
    winRate: 0.75,
    totalMatches: 500,
    wins: 375,
    losses: 125,
    bio: 'Professional Fortnite player and streamer',
    location: 'United States',
    socialLinks: [
      { platform: 'twitch', url: 'https://twitch.tv/ninja' },
      { platform: 'twitter', url: 'https://twitter.com/ninja' }
    ]
  },
  {
    username: 'shroud',
    displayName: 'Shroud',
    mainGame: 'Valorant',
    profileImage: 'https://res.cloudinary.com/dxm7nytrd/image/upload/v1650123456/players/shroud.jpg',
    winRate: 0.82,
    totalMatches: 450,
    wins: 369,
    losses: 81,
    bio: 'Former CS:GO professional, now streaming various FPS games',
    location: 'Canada',
    socialLinks: [
      { platform: 'twitch', url: 'https://twitch.tv/shroud' },
      { platform: 'youtube', url: 'https://youtube.com/shroud' }
    ]
  },
  {
    username: 's1mple',
    displayName: 'S1mple',
    mainGame: 'CS:GO',
    profileImage: 'https://res.cloudinary.com/dxm7nytrd/image/upload/v1650123456/players/s1mple.jpg',
    winRate: 0.88,
    totalMatches: 800,
    wins: 704,
    losses: 96,
    bio: 'Professional CS:GO player for Natus Vincere',
    location: 'Ukraine',
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com/s1mpleO' },
      { platform: 'instagram', url: 'https://instagram.com/s1mpleo' }
    ]
  },
  {
    username: 'faker',
    displayName: 'Faker',
    mainGame: 'League of Legends',
    profileImage: 'https://res.cloudinary.com/dxm7nytrd/image/upload/v1650123456/players/faker.jpg',
    winRate: 0.79,
    totalMatches: 1200,
    wins: 948,
    losses: 252,
    bio: 'Professional League of Legends player for T1, considered one of the best players of all time',
    location: 'South Korea',
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com/faker' },
      { platform: 'youtube', url: 'https://youtube.com/c/faker' }
    ]
  },
  {
    username: 'bugha',
    displayName: 'Bugha',
    mainGame: 'Fortnite',
    profileImage: 'https://res.cloudinary.com/dxm7nytrd/image/upload/v1650123456/players/bugha.jpg',
    winRate: 0.72,
    totalMatches: 600,
    wins: 432,
    losses: 168,
    bio: 'Fortnite World Cup Solo Champion',
    location: 'United States',
    socialLinks: [
      { platform: 'twitch', url: 'https://twitch.tv/bugha' },
      { platform: 'twitter', url: 'https://twitter.com/bugha' }
    ]
  },
  {
    username: 'scump',
    displayName: 'Scump',
    mainGame: 'Call of Duty',
    profileImage: 'https://res.cloudinary.com/dxm7nytrd/image/upload/v1650123456/players/scump.jpg',
    winRate: 0.77,
    totalMatches: 950,
    wins: 731,
    losses: 219,
    bio: 'Professional Call of Duty player for OpTic Gaming',
    location: 'United States',
    socialLinks: [
      { platform: 'twitch', url: 'https://twitch.tv/scump' },
      { platform: 'youtube', url: 'https://youtube.com/user/scumperjumper' }
    ]
  },
  {
    username: 'tfue',
    displayName: 'Tfue',
    mainGame: 'Fortnite',
    profileImage: 'https://res.cloudinary.com/dxm7nytrd/image/upload/v1650123456/players/tfue.jpg',
    winRate: 0.73,
    totalMatches: 750,
    wins: 547,
    losses: 203,
    bio: 'Former Fortnite professional player and content creator',
    location: 'United States',
    socialLinks: [
      { platform: 'twitch', url: 'https://twitch.tv/tfue' },
      { platform: 'youtube', url: 'https://youtube.com/tfue' }
    ]
  },
  {
    username: 'pokimane',
    displayName: 'Pokimane',
    mainGame: 'Valorant',
    profileImage: 'https://res.cloudinary.com/dxm7nytrd/image/upload/v1650123456/players/pokimane.jpg',
    winRate: 0.65,
    totalMatches: 350,
    wins: 227,
    losses: 123,
    bio: 'Content creator and streamer',
    location: 'United States',
    socialLinks: [
      { platform: 'twitch', url: 'https://twitch.tv/pokimane' },
      { platform: 'twitter', url: 'https://twitter.com/pokimanelol' }
    ]
  }
];

export async function GET(req: NextRequest) {
  try {
    const result = await seedPlayers(samplePlayers);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('Error seeding players:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to seed players',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 