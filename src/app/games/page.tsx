import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function GamesPage() {
  const games = [
    {
      id: 'valorant',
      name: 'Valorant',
      description: 'Compete in high-stakes tactical shooter tournaments featuring Valorant, Riot Games\' popular 5v5 character-based tactical FPS.',
      image: '/images/valorant.jpg',
      tournamentCount: 8
    },
    {
      id: 'bgmi',
      name: 'BGMI',
      description: 'Join Battlegrounds Mobile India competitions and showcase your battle royale skills in solo, duo, or squad formats.',
      image: '/images/bgmi.jpg',
      tournamentCount: 5
    },
    {
      id: 'cod-mobile',
      name: 'COD Mobile',
      description: 'Participate in Call of Duty Mobile tournaments featuring both multiplayer and battle royale formats.',
      image: '/images/cod-mobile.jpg',
      tournamentCount: 3
    },
    {
      id: 'free-fire',
      name: 'Free Fire',
      description: 'Compete in Garena Free Fire tournaments with fast-paced battle royale action on mobile devices.',
      image: '/images/free-fire.jpg',
      tournamentCount: 4
    },
    {
      id: 'fifa',
      name: 'FIFA',
      description: 'Test your football gaming skills in competitive FIFA tournaments for both casual and professional players.',
      image: '/images/fifa.jpg',
      tournamentCount: 2
    },
    {
      id: 'other',
      name: 'Other Games',
      description: 'Explore additional tournaments featuring various competitive games across different platforms.',
      image: '/images/other-games.jpg',
      tournamentCount: 6
    }
  ];
  
  return (
    <div className="bg-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Game Categories</h1>
            <p className="text-xl text-gray-300 mb-8">
              Explore our selection of competitive game categories and join tournaments that match your skills and interests.
            </p>
          </div>
        </div>
      </section>
      
      {/* Games Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => (
              <div key={game.id} className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="h-48 relative">
                  <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-2xl font-bold">{game.name}</h2>
                    <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full">
                      {game.tournamentCount} Tournaments
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{game.description}</p>
                  <div className="flex justify-between items-center">
                    <Link 
                      href={`/games/${game.id}`}
                      className="text-orange-400 font-semibold hover:text-orange-500"
                    >
                      View Details →
                    </Link>
                    <Link 
                      href={`/tournaments?game=${game.id}`}
                      className="bg-slate-700 hover:bg-slate-600 transition-colors text-white px-4 py-2 rounded-md text-sm"
                    >
                      View Tournaments
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Don't see your favorite game?</h2>
              <p className="text-xl mb-6">
                We're constantly expanding our tournament offerings. Let us know what games you'd like to see on our platform!
              </p>
              <Link 
                href="/contact"
                className="inline-block bg-white text-orange-600 px-6 py-3 rounded-md font-semibold hover:bg-slate-100 transition-colors"
              >
                Request a Game
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 