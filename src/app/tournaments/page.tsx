"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';

// Tournament type definition
type Tournament = {
  id: number;
  name: string;
  game: string;
  gameImage: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  prizePool: string;
  teamSize: number;
  maxTeams: number;
  currentTeams: number;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  organizer: {
    name: string;
    verified: boolean;
  };
};

export default function TournamentsPage() {
  // State for filtering and sorting
  const [filters, setFilters] = useState({
    game: 'all',
    status: 'all',
    teamSize: 'all',
  });
  
  const [sortBy, setSortBy] = useState('startDate');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFallbackData, setIsFallbackData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize tournaments on mount
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoading(true);
        
        // Build query params
        const queryParams = new URLSearchParams();
        
        if (filters.game !== 'all') {
          queryParams.append('game', filters.game);
        }
        
        if (filters.status !== 'all') {
          queryParams.append('status', filters.status);
        }
        
        if (filters.teamSize !== 'all') {
          queryParams.append('teamSize', filters.teamSize);
        }
        
        queryParams.append('sortBy', sortBy);
        
        // Make API call to fetch tournaments from our backend
        const response = await axios.get(`/api/tournaments?${queryParams.toString()}`);
        
        // Set fallback flag if data is mock data
        setIsFallbackData(response.data.isFallback || false);
        
        // Filter results by search query if provided
        let filteredTournaments = response.data.tournaments;
        
        if (searchQuery.trim() !== '') {
          const query = searchQuery.toLowerCase().trim();
          filteredTournaments = filteredTournaments.filter((tournament: Tournament) => 
            tournament.name.toLowerCase().includes(query) ||
            tournament.game.toLowerCase().includes(query) ||
            tournament.location.toLowerCase().includes(query)
          );
        }
        
        setTournaments(filteredTournaments);
        setError(null);
      } catch (err) {
        console.error('Error fetching tournaments:', err);
        setError('Failed to load tournaments. Please try again later.');
        setTournaments([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTournaments();
  }, [filters, sortBy, searchQuery]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters({
      ...filters,
      [filterType]: value
    });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500';
      case 'ongoing':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Define a type for registration status to include the canRegister property
  type RegistrationStatus = {
    text: string;
    color: string;
    canRegister: boolean;
  };

  const getRegistrationStatus = (tournament: Tournament): RegistrationStatus => {
    if (tournament.status === 'completed') {
      return { text: 'Tournament Ended', color: 'text-gray-400', canRegister: false };
    }
    
    if (tournament.status === 'ongoing') {
      return { text: 'In Progress', color: 'text-green-400', canRegister: false };
    }
    
    if (tournament.currentTeams >= tournament.maxTeams) {
      return { text: 'Registration Closed', color: 'text-red-400', canRegister: false };
    }
    
    if (new Date() > new Date(tournament.registrationDeadline)) {
      return { text: 'Registration Closed', color: 'text-red-400', canRegister: false };
    }
    
    return { text: 'Registration Open', color: 'text-orange-400', canRegister: true };
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-20 bg-center bg-cover"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/tournaments-bg.jpg')`,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Tournaments</h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover and join competitive gaming tournaments across India. Show your skills and compete for prizes!
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Search tournaments..."
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-full py-3 px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg 
                className="absolute right-4 top-3 w-6 h-6 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>
      
      {/* Filter Section */}
      <section className="py-8 bg-slate-800 border-t border-b border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex flex-wrap gap-4 md:gap-6">
              {/* Game Filter */}
              <div>
                <label htmlFor="game-filter" className="block text-sm text-gray-400 mb-1">Game</label>
                <select
                  id="game-filter"
                  className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
                  value={filters.game}
                  onChange={(e) => handleFilterChange('game', e.target.value)}
                >
                  <option value="all">All Games</option>
                  <option value="Valorant">Valorant</option>
                  <option value="BGMI">BGMI</option>
                  <option value="Counter-Strike 2">Counter-Strike 2</option>
                  <option value="Fortnite">Fortnite</option>
                  <option value="Apex Legends">Apex Legends</option>
                  <option value="Dota 2">Dota 2</option>
                </select>
              </div>
              
              {/* Status Filter */}
              <div>
                <label htmlFor="status-filter" className="block text-sm text-gray-400 mb-1">Status</label>
                <select
                  id="status-filter"
                  className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              {/* Team Size Filter */}
              <div>
                <label htmlFor="team-size-filter" className="block text-sm text-gray-400 mb-1">Team Size</label>
                <select
                  id="team-size-filter"
                  className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
                  value={filters.teamSize}
                  onChange={(e) => handleFilterChange('teamSize', e.target.value)}
                >
                  <option value="all">All Sizes</option>
                  <option value="1">Solo</option>
                  <option value="2">Duo</option>
                  <option value="3">Trio</option>
                  <option value="4">Squad (4)</option>
                  <option value="5">Team (5)</option>
                </select>
              </div>
            </div>
            
            {/* Sort Options */}
            <div>
              <label htmlFor="sort-by" className="block text-sm text-gray-400 mb-1">Sort By</label>
              <select
                id="sort-by"
                className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Date (Soonest)</option>
                <option value="prize">Prize Pool (Highest)</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tournament List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Tournaments Grid */}
          <div className="mt-8">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-xl">Loading tournaments...</div>
              </div>
            ) : error ? (
              <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6">
                <p>{error}</p>
              </div>
            ) : tournaments.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No tournaments found</h3>
                <p className="text-gray-400">Try adjusting your filters or check back later for new tournaments.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map((tournament) => (
                  <motion.div 
                    key={tournament.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3 h-48 md:h-auto relative">
                        <Image
                          src={tournament.gameImage}
                          alt={tournament.game}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 to-transparent p-4 flex flex-col justify-between">
                          <span className={`${getStatusBadgeColor(tournament.status)} px-2 py-1 rounded-full text-xs font-semibold text-white w-fit`}>
                            {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                          </span>
                          <div>
                            <span className="bg-slate-800/90 text-white text-xs px-2 py-1 rounded">
                              {tournament.game}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-2xl font-bold mb-2">{tournament.name}</h2>
                            <div className="flex items-center mb-4">
                              <span className="text-sm text-gray-400 flex items-center">
                                <span className="mr-1">By</span>
                                <span className="font-semibold text-white">{tournament.organizer.name}</span>
                                {tournament.organizer.verified && (
                                  <svg className="ml-1 w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                                  </svg>
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="bg-orange-500/20 text-orange-400 font-bold px-3 py-1 rounded-md">
                            {tournament.prizePool}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-400">Start Date</p>
                            <p className="font-semibold">{formatDate(tournament.startDate)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">End Date</p>
                            <p className="font-semibold">{formatDate(tournament.endDate)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Team Size</p>
                            <p className="font-semibold">{tournament.teamSize === 1 ? 'Solo' : `${tournament.teamSize} Players`}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Teams</p>
                            <p className="font-semibold">{tournament.currentTeams} / {tournament.maxTeams}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center mb-4">
                          <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          <span className="text-sm text-gray-300">{tournament.location}</span>
                          
                          <div className="ml-4 flex items-center">
                            <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span className="text-sm text-gray-300">
                              Registration Deadline: {formatDate(tournament.registrationDeadline)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-6">
                          <span className={`${getRegistrationStatus(tournament).color} text-sm font-semibold`}>
                            {getRegistrationStatus(tournament).text}
                          </span>
                          <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <Link
                              href={`/tournaments/${tournament.id}`}
                              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-md text-center transition-colors flex-1"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Host Tournament CTA */}
      <section className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-8 md:p-12">
            <div className="md:flex items-center justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h2 className="text-3xl font-bold mb-4">Want to host your own tournament?</h2>
                <p className="text-gray-300 mb-6">
                  If you're interested in organizing a tournament on our platform, we'd love to hear from you. 
                  Our team will work with you to set up the perfect competitive experience.
                </p>
                <Link 
                  href="/host-tournament"
                  className="inline-block bg-orange-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-700 transition-colors"
                >
                  Host a Tournament
                </Link>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <svg className="w-48 h-48 text-orange-500 opacity-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707L15.414 3l.707-.707a1 1 0 111.414 1.414l-.707.707 1.707 1.707a1 1 0 01-1.414 1.414L16.414 6l-.707.707a1 1 0 01-1.414-1.414l.707-.707L13 3.293a1 1 0 010-1.414 1 1 0 01.707-.293zm0 10a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L13 15.414l-1.293 1.293a1 1 0 01-1.414-1.414l4-4a1 1 0 01.707-.293z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 