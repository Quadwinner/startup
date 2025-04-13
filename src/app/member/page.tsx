"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function MemberDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [tournamentHistory, setTournamentHistory] = useState([]);
  const [joinDate, setJoinDate] = useState('');

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      // If not authenticated, redirect to login
      if (status === 'unauthenticated') {
        router.push('/login?callbackUrl=/member');
        return;
      }

      if (status !== 'authenticated') return;

      setLoading(true);
      try {
        // Fetch profile data
        const profileResponse = await axios.get('/api/profile');
        setProfileData(profileResponse.data.profile);
        
        // Format join date
        if (profileResponse.data.profile?.createdAt) {
          const date = new Date(profileResponse.data.profile.createdAt);
          setJoinDate(date.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          }));
        }

        // Fetch tournament history
        const historyResponse = await axios.get('/api/profile/history');
        setTournamentHistory(historyResponse.data.history);

        setError('');
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load member data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [status, router]);

  // If still loading the session
  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // If error occurred
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-900 text-white p-4">
        <div className="text-red-500 text-2xl mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Generate player statistics based on fetched data
  const playerStats = {
    totalMatches: profileData?.totalMatches || 0,
    wins: profileData?.matchesWon || 0,
    winRate: profileData?.totalMatches ? Math.round((profileData.matchesWon / profileData.totalMatches) * 100) : 0,
    tournaments: profileData?.totalTournaments || 0
  };

  // Get recent tournament registrations
  const recentTournaments = tournamentHistory
    .sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0))
    .slice(0, 3);

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      {/* Header with user info */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 py-10">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-col md:flex-row items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-slate-600 h-24 w-24 rounded-full flex items-center justify-center text-4xl font-bold mb-4 md:mb-0 md:mr-6 overflow-hidden">
              {profileData?.avatarUrl ? (
                <Image 
                  src={profileData.avatarUrl} 
                  alt={profileData.displayName || profileData.username} 
                  width={96} 
                  height={96}
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                (profileData?.displayName || session?.user?.name)?.charAt(0) || 'U'
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{profileData?.displayName || session?.user?.name || 'Member'}</h1>
              <p className="text-gray-300">{profileData?.email || session?.user?.email}</p>
              <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">
                  Member Since: {joinDate || 'Recently'}
                </span>
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                  {profileData?.experienceLevel ? 
                    `${profileData.experienceLevel.charAt(0).toUpperCase()}${profileData.experienceLevel.slice(1)}` : 
                    'Member'}
                </span>
              </div>
            </div>
            <div className="flex-grow"></div>
            <div className="mt-6 md:mt-0">
              <Link 
                href="/performance"
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded transition-colors inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Performance
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide space-x-4 py-4">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-2 rounded-full transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('teams')}
              className={`px-6 py-2 rounded-full transition-colors whitespace-nowrap ${activeTab === 'teams' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
            >
              My Teams
            </button>
            <button 
              onClick={() => setActiveTab('tournaments')}
              className={`px-6 py-2 rounded-full transition-colors whitespace-nowrap ${activeTab === 'tournaments' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
            >
              My Tournaments
            </button>
            <button 
              onClick={() => setActiveTab('achievements')}
              className={`px-6 py-2 rounded-full transition-colors whitespace-nowrap ${activeTab === 'achievements' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
            >
              Achievements
            </button>
          </div>
        </div>
      </div>
      
      {/* Content Based on Active Tab */}
      <div className="container mx-auto px-4 py-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div 
                className="bg-slate-800 rounded-lg p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-3xl font-bold mb-2">{playerStats.totalMatches}</div>
                <div className="text-gray-400">Total Matches</div>
              </motion.div>
              
              <motion.div 
                className="bg-slate-800 rounded-lg p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="text-3xl font-bold mb-2">{playerStats.wins}</div>
                <div className="text-gray-400">Matches Won</div>
              </motion.div>
              
              <motion.div 
                className="bg-slate-800 rounded-lg p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="text-3xl font-bold mb-2">{playerStats.winRate}%</div>
                <div className="text-gray-400">Win Rate</div>
              </motion.div>
              
              <motion.div 
                className="bg-slate-800 rounded-lg p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="text-3xl font-bold mb-2">{playerStats.tournaments}</div>
                <div className="text-gray-400">Tournaments</div>
              </motion.div>
            </div>
            
            {/* Recent Tournaments */}
            <motion.div 
              className="bg-slate-800 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent Tournaments</h2>
                <Link 
                  href="/tournaments"
                  className="text-orange-400 hover:text-orange-300 text-sm"
                >
                  Browse All Tournaments
                </Link>
              </div>
              
              {recentTournaments.length > 0 ? (
                <div className="space-y-4">
                  {recentTournaments.map((tournament, index) => (
                    <div 
                      key={tournament.registrationId || index} 
                      className="bg-slate-700 rounded-lg p-4 flex flex-col md:flex-row justify-between"
                    >
                      <div>
                        <h3 className="font-medium text-lg">{tournament.tournamentName}</h3>
                        <p className="text-gray-400">{tournament.game}</p>
                      </div>
                      <div className="mt-2 md:mt-0 flex flex-wrap gap-2 md:text-right">
                        <span className="inline-block text-sm py-1 px-3 rounded-full bg-slate-600 text-gray-300">
                          {tournament.startDate || 'TBD'}
                        </span>
                        <span className={`inline-block text-sm py-1 px-3 rounded-full ${
                          tournament.registrationStatus === 'approved' ? 'bg-green-500 text-white' : 
                          tournament.registrationStatus === 'pending' ? 'bg-yellow-500 text-black' : 
                          tournament.registrationStatus === 'completed' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {tournament.registrationStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-700 rounded-lg">
                  <p className="text-gray-300 mb-4">You haven't participated in any tournaments yet.</p>
                  <Link 
                    href="/tournaments"
                    className="inline-block bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors"
                  >
                    Browse Tournaments
                  </Link>
                </div>
              )}
            </motion.div>
            
            {/* Profile Preview */}
            <motion.div 
              className="bg-slate-800 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Profile Preview</h2>
                <Link 
                  href={`/profile/${profileData?.username || 'me'}`}
                  className="text-orange-400 hover:text-orange-300 text-sm"
                >
                  View Full Profile
                </Link>
              </div>
              
              <div className="bg-slate-700 p-6 rounded-lg">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="mb-4">
                      <h3 className="text-sm text-gray-400 mb-1">Username</h3>
                      <p>@{profileData?.username || 'username'}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm text-gray-400 mb-1">Main Game</h3>
                      <p>{profileData?.mainGame || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400 mb-1">Experience Level</h3>
                      <p>{profileData?.experienceLevel ? 
                          `${profileData.experienceLevel.charAt(0).toUpperCase()}${profileData.experienceLevel.slice(1)}` : 
                          'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <h3 className="text-sm text-gray-400 mb-1">Bio</h3>
                    <p className="mb-4">{profileData?.bio || 'No bio added yet.'}</p>
                    
                    {profileData?.country && (
                      <div className="mb-4">
                        <h3 className="text-sm text-gray-400 mb-1">Location</h3>
                        <p>{[profileData.city, profileData.state, profileData.country].filter(Boolean).join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* My Teams Tab */}
        {activeTab === 'teams' && (
          <motion.div 
            className="bg-slate-800 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-6">My Teams</h2>
            
            {/* Placeholder for teams - will be implemented in a future update */}
            <div className="text-center p-8 bg-slate-700 rounded-lg">
              <p className="text-xl text-gray-300 mb-4">Team management is coming soon!</p>
              <p className="text-gray-400 mb-6">You'll be able to create and join teams, manage team members, and participate in tournaments as a team.</p>
              <Link 
                href="/tournaments"
                className="inline-block bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors"
              >
                Browse Tournaments
              </Link>
            </div>
          </motion.div>
        )}
        
        {/* My Tournaments Tab */}
        {activeTab === 'tournaments' && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">My Tournaments</h2>
              
              {tournamentHistory.length > 0 ? (
                <div className="space-y-4">
                  {tournamentHistory.map((tournament, index) => (
                    <div 
                      key={tournament.registrationId || index} 
                      className="bg-slate-700 rounded-lg overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <h3 className="font-bold text-lg mb-1">{tournament.tournamentName}</h3>
                            <p className="text-gray-400">{tournament.game}</p>
                            <div className="mt-2">
                              <span className="text-sm text-gray-400">Team: {tournament.teamName || 'Individual'}</span>
                            </div>
                          </div>
                          <div className="mt-3 md:mt-0 md:text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              tournament.registrationStatus === 'approved' ? 'bg-green-600' : 
                              tournament.registrationStatus === 'pending' ? 'bg-yellow-600' : 
                              tournament.registrationStatus === 'completed' ? 'bg-blue-600' : 'bg-red-600'
                            }`}>
                              {tournament.registrationStatus}
                            </span>
                            <div className="mt-2 text-sm">{tournament.startDate || 'Date TBD'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-700 rounded-lg">
                  <p className="text-gray-300 mb-4">You haven't registered for any tournaments yet.</p>
                  <Link 
                    href="/tournaments"
                    className="inline-block bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors"
                  >
                    Browse Tournaments
                  </Link>
                </div>
              )}
            </div>
            
            <motion.div 
              className="bg-slate-800 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl font-bold mb-6">Recommended Tournaments</h2>
              <Link 
                href="/tournaments"
                className="block text-center py-8 bg-slate-700 rounded-lg text-gray-300 hover:bg-slate-600 transition-all"
              >
                Browse all available tournaments
              </Link>
            </motion.div>
          </motion.div>
        )}
        
        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <motion.div 
            className="bg-slate-800 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-6">Achievements</h2>
            
            {profileData?.achievements?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileData.achievements.map((achievement, index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="text-2xl mr-3">{achievement.icon || '🏆'}</div>
                      <div>
                        <h3 className="font-medium">{achievement.title}</h3>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                        {achievement.awarded_at && (
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(achievement.awarded_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-700 rounded-lg">
                <p className="text-gray-300 mb-4">No achievements yet. Participate in tournaments to earn achievements!</p>
                <Link 
                  href="/tournaments"
                  className="inline-block bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors"
                >
                  Browse Tournaments
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}