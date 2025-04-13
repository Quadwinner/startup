"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Profile {
  id: string;
  userId: string;
  username: string;
  displayName?: string;
  bio?: string;
  mainGame?: string;
  country?: string;
  state?: string;
  city?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  socialLinks?: any[];
  experienceLevel?: string;
  achievements?: any[];
  totalTournaments: number;
  tournamentsWon: number;
  totalMatches: number;
  matchesWon: number;
}

interface TournamentHistory {
  registrationId: string;
  tournamentId: string;
  tournamentName: string;
  game: string;
  startDate: string;
  endDate: string;
  teamName: string;
  registrationStatus: string;
  paymentStatus: string;
  registrationDate: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<TournamentHistory[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Load profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/profile');
        setProfile(response.data.profile);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        
        if (err.response?.status === 404 && err.response?.data?.needsSetup) {
          // Redirect to profile setup if needed
          router.push('/profile/setup');
          return;
        }
        
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/api/profile/history');
        setHistory(response.data.history);
      } catch (err) {
        console.error('Error fetching tournament history:', err);
      }
    };
    
    if (status === 'authenticated' && session) {
      fetchProfile();
      fetchHistory();
    } else if (status === 'unauthenticated') {
      router.push('/login?redirect=/profile');
    }
  }, [session, status, router]);
  
  // Format date string
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBD';
    
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-IN', options);
    } catch (e) {
      console.error('Invalid date format:', dateString);
      return 'Invalid Date';
    }
  };
  
  // Calculate win rate
  const calculateWinRate = () => {
    if (!profile || profile.totalMatches === 0) return 0;
    return Math.round((profile.matchesWon / profile.totalMatches) * 100);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading profile...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <div className="text-xl text-red-400 mb-4">{error}</div>
        <Link href="/" className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
          Go Home
        </Link>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <div className="text-xl mb-4">Profile not found</div>
        <Link href="/profile/setup" className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
          Create Profile
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Banner and Profile Header */}
      <div className="relative h-64 md:h-80">
        {profile.bannerUrl ? (
          <Image 
            src={profile.bannerUrl}
            alt="Profile banner"
            fill
            style={{ objectFit: 'cover' }}
            className="opacity-70"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-800"></div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 h-24"></div>
      </div>
      
      <div className="container mx-auto px-4 -mt-20">
        <div className="flex flex-col md:flex-row">
          {/* Profile Avatar and Info */}
          <div className="md:w-1/3">
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden bg-orange-500 mr-4 border-4 border-gray-800">
                    {profile.avatarUrl ? (
                      <Image 
                        src={profile.avatarUrl}
                        alt={profile.username}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-white text-4xl font-bold">
                        {profile.displayName?.charAt(0) || profile.username.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{profile.displayName || profile.username}</h1>
                    <div className="text-gray-400 text-sm">@{profile.username}</div>
                    {profile.experienceLevel && (
                      <div className="mt-1">
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                          {profile.experienceLevel ? 
                            `${profile.experienceLevel.charAt(0).toUpperCase()}${profile.experienceLevel.slice(1)}` : 
                            'Beginner'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {profile.bio && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Bio</h3>
                    <p className="text-gray-300">{profile.bio}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-orange-400">{profile.totalTournaments || 0}</div>
                    <div className="text-sm text-gray-300">Tournaments</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-orange-400">{calculateWinRate()}%</div>
                    <div className="text-sm text-gray-300">Win Rate</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Details</h3>
                  <ul className="space-y-2">
                    {profile.mainGame && (
                      <li className="flex items-center text-gray-300">
                        <svg className="h-5 w-5 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H13V5.055L11 3.055z" />
                        </svg>
                        Main Game: {profile.mainGame}
                      </li>
                    )}
                    {(profile.city || profile.state || profile.country) && (
                      <li className="flex items-center text-gray-300">
                        <svg className="h-5 w-5 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}
                      </li>
                    )}
                  </ul>
                </div>
                
                <div className="mt-6">
                  <Link 
                    href="/profile/edit" 
                    className="bg-orange-500 text-white w-full py-2 rounded-lg flex items-center justify-center hover:bg-orange-600 transition"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:w-2/3 md:pl-8 mt-8 md:mt-0">
            {/* Tabs */}
            <div className="flex border-b border-gray-700 mb-6">
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'tournaments' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('tournaments')}
              >
                Tournaments
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'achievements' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('achievements')}
              >
                Achievements
              </button>
            </div>
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <motion.div 
                  className="bg-gray-800 rounded-lg p-6 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Stats Overview</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-400">{profile.totalTournaments || 0}</div>
                      <div className="text-sm text-gray-300">Tournaments</div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-400">{profile.tournamentsWon || 0}</div>
                      <div className="text-sm text-gray-300">Tournaments Won</div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-400">{profile.totalMatches || 0}</div>
                      <div className="text-sm text-gray-300">Matches Played</div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-400">{profile.matchesWon || 0}</div>
                      <div className="text-sm text-gray-300">Matches Won</div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-800 rounded-lg p-6 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Recent Tournaments</h2>
                  {history.length > 0 ? (
                    <div className="space-y-4">
                      {history.slice(0, 3).map((item) => (
                        <div key={item.registrationId} className="flex items-start border-b border-gray-700 pb-4">
                          <div className="bg-gray-700 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                            <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <div>
                            <Link href={`/tournaments/${item.tournamentId}`}>
                              <h3 className="font-semibold text-lg hover:text-orange-400">{item.tournamentName}</h3>
                            </Link>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-sm text-gray-400">Team: {item.teamName || 'Individual'}</span>
                              <span className="text-sm text-gray-400">• {item.game || 'Unknown Game'}</span>
                              <span className="text-sm text-gray-400">• {item.startDate ? formatDate(item.startDate) : 'TBD'}</span>
                            </div>
                            <div className="mt-2 flex gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${item.registrationStatus === 'approved' ? 'bg-green-500/20 text-green-400' : item.registrationStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                {item.registrationStatus ? `${item.registrationStatus.charAt(0).toUpperCase()}${item.registrationStatus.slice(1)}` : 'Unknown'}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${item.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' : item.paymentStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                {item.paymentStatus ? `${item.paymentStatus.charAt(0).toUpperCase()}${item.paymentStatus.slice(1)}` : 'Unknown'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <svg className="h-12 w-12 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <p>You haven't participated in any tournaments yet</p>
                      <Link href="/tournaments" className="mt-4 inline-block px-4 py-2 bg-orange-500 text-white rounded-lg">
                        Browse Tournaments
                      </Link>
                    </div>
                  )}
                  {history.length > 3 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setActiveTab('tournaments')} 
                        className="text-orange-400 hover:text-orange-500"
                      >
                        View All Tournaments →
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
            
            {/* Tournaments Tab */}
            {activeTab === 'tournaments' && (
              <motion.div 
                className="bg-gray-800 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold mb-4">Tournament History</h2>
                {history.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-gray-700">
                          <th className="pb-2">Tournament</th>
                          <th className="pb-2">Game</th>
                          <th className="pb-2">Date</th>
                          <th className="pb-2">Team</th>
                          <th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((item) => (
                          <tr key={item.registrationId} className="border-b border-gray-700">
                            <td className="py-3">
                              <Link href={`/tournaments/${item.tournamentId}`} className="hover:text-orange-400">
                                {item.tournamentName}
                              </Link>
                            </td>
                            <td className="py-3">{item.game || 'Unknown Game'}</td>
                            <td className="py-3">{item.startDate ? formatDate(item.startDate) : 'TBD'}</td>
                            <td className="py-3">{item.teamName || 'Individual'}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${item.registrationStatus === 'approved' ? 'bg-green-500/20 text-green-400' : item.registrationStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                {item.registrationStatus ? `${item.registrationStatus.charAt(0).toUpperCase()}${item.registrationStatus.slice(1)}` : 'Unknown'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <svg className="h-12 w-12 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p>You haven't participated in any tournaments yet</p>
                    <Link href="/tournaments" className="mt-4 inline-block px-4 py-2 bg-orange-500 text-white rounded-lg">
                      Browse Tournaments
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <motion.div 
                className="bg-gray-800 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold mb-4">Achievements</h2>
                {profile.achievements && profile.achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.achievements.map((achievement, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-4 flex items-start">
                        <div className="rounded-full bg-orange-500/20 p-3 mr-4">
                          <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                          {achievement.date && (
                            <div className="text-xs text-gray-500 mt-2">
                              Achieved on {formatDate(achievement.date)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <svg className="h-12 w-12 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <p>No achievements yet</p>
                    <p className="mt-2 text-sm">Participate in tournaments and events to earn achievements</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 