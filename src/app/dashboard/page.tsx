"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Dashboard page combining profile, account settings, and member dashboard
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [tournamentHistory, setTournamentHistory] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  // Load profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/profile');
        setProfile(response.data.profile);
      } catch (err) {
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
        setLoading(true);
        const response = await axios.get('/api/profile/history');
        console.log('Tournament history response:', response.data);
        
        if (response.data && response.data.history) {
          setHistory(response.data.history);
          setTournamentHistory(response.data.history);
          console.log('Tournament history set:', response.data.history);
        } else {
          console.warn('No tournament history data found');
          setTournamentHistory([]);
        }
      } catch (err) {
        console.error('Error fetching tournament history:', err);
        setTournamentHistory([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (status === 'authenticated' && session) {
      fetchProfile();
      fetchHistory();
    } else if (status === 'unauthenticated') {
      router.push('/login?redirect=/dashboard');
    }
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading dashboard...</div>
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
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      {/* Top Header with User Info */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-orange-500">
                {profile.avatarUrl ? (
                  <Image 
                    src={profile.avatarUrl}
                    alt={profile.username}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-white text-lg font-bold">
                    {profile.displayName?.charAt(0) || profile.username.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium">{profile.displayName || profile.username}</div>
                <div className="text-sm text-gray-400">@{profile.username}</div>
              </div>
            </div>
            <Link href="/tournaments" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">
              Browse Tournaments
            </Link>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Navigation */}
        <div className="flex flex-wrap border-b border-gray-700 mb-8">
          <button
            className={`px-5 py-3 font-medium ${activeTab === 'profile' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`px-5 py-3 font-medium ${activeTab === 'tournaments' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('tournaments')}
          >
            My Tournaments
          </button>
          <button
            className={`px-5 py-3 font-medium ${activeTab === 'account' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('account')}
          >
            Account Settings
          </button>
          <button
            className={`px-5 py-3 font-medium ${activeTab === 'achievements' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <>
            {/* Under Development Banner */}
            <div className="bg-blue-900/50 border border-blue-400 rounded-lg p-4 mb-8 flex items-center">
              <svg className="h-6 w-6 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <p className="font-medium text-blue-300">This section is under development. Coming soon!</p>
                <p className="text-sm text-blue-300/80 mt-1">We're working hard to bring you more features.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Details */}
              <div className="md:col-span-1">
                <motion.div 
                  className="bg-gray-800 rounded-lg p-6 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-6">
                    <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden bg-orange-500 mb-4">
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
                    <h2 className="text-xl font-bold">{profile.displayName || profile.username}</h2>
                    <div className="text-gray-400 text-sm mb-2">@{profile.username}</div>
                    {profile.experienceLevel && (
                      <div className="mb-4">
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                          {profile.experienceLevel ? 
                            `${profile.experienceLevel.charAt(0).toUpperCase()}${profile.experienceLevel.slice(1)}` : 
                            'Beginner'}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
                      <Link 
                        href="/profile/edit" 
                        className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                      >
                        Edit Profile
                      </Link>
                      <Link 
                        href={`/profile/${profile.username}`} 
                        className="inline-block bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                      >
                        View Public Profile
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {profile.bio && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Bio</h3>
                        <p className="text-gray-300">{profile.bio}</p>
                      </div>
                    )}

                    {profile.mainGame && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Main Game</h3>
                        <p className="text-gray-300">{profile.mainGame}</p>
                      </div>
                    )}

                    {(profile.city || profile.state || profile.country) && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Location</h3>
                        <p className="text-gray-300">{[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Stats and Recent Activity */}
              <div className="md:col-span-2">
                <motion.div 
                  className="bg-gray-800 rounded-lg p-6 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
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
                  className="bg-gray-800 rounded-lg p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  {history.length > 0 ? (
                    <div className="space-y-4">
                      {history.slice(0, 3).map((item: any) => {
                        // Handle both legacy and new data formats
                        const tournamentName = item.tournamentName || 
                          (item.tournaments?.name) || 
                          'Unknown Tournament';
                        
                        const tournamentId = item.tournamentId || 
                          item.tournament_id || 
                          (item.tournaments?.id) || 
                          '1';
                          
                        const game = item.game || 
                          (item.tournaments?.game) || 
                          'Unknown Game';
                        
                        const teamName = item.teamName || 
                          item.team_name || 
                          'Individual';
                          
                        const status = item.registrationStatus || 
                          item.status || 
                          'pending';
                        
                        return (
                          <div key={item.id || item.registrationId} className="flex items-start border-b border-gray-700 pb-4">
                            <div className="bg-gray-700 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                              <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                            <div>
                              <Link href={`/tournaments/${tournamentId}`}>
                                <h3 className="font-semibold text-lg hover:text-orange-400">{tournamentName}</h3>
                              </Link>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <span className="text-sm text-gray-400">Team: {teamName}</span>
                                <span className="text-sm text-gray-400">• {game}</span>
                              </div>
                              <div className="mt-2 flex gap-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  status === 'approved' ? 'bg-green-500/20 text-green-400' : 
                                  status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                                  status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-red-500/20 text-red-400'}`}>
                                  {status ? `${status.charAt(0).toUpperCase()}${status.slice(1)}` : 'Unknown'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>No recent activity</p>
                      <Link href="/tournaments" className="mt-4 inline-block px-4 py-2 bg-orange-500 text-white rounded-lg">
                        Browse Tournaments
                      </Link>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </>
        )}

        {/* Tournaments Tab */}
        {activeTab === 'tournaments' && (
          <motion.div 
            className="bg-gray-800 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Tournaments</h2>
              <Link href="/tournaments" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600">
                Find Tournaments
              </Link>
            </div>
            
            {history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-700">
                      <th className="pb-4">Tournament</th>
                      <th className="pb-4">Game</th>
                      <th className="pb-4">Date</th>
                      <th className="pb-4">Team</th>
                      <th className="pb-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item: any) => {
                      // Handle both legacy and new data formats
                      const tournamentName = item.tournamentName || 
                        (item.tournaments?.name) || 
                        'Unknown Tournament';
                      
                      const tournamentId = item.tournamentId || 
                        item.tournament_id || 
                        (item.tournaments?.id) || 
                        '1';
                        
                      const game = item.game || 
                        (item.tournaments?.game) || 
                        'Unknown Game';
                        
                      const startDate = item.startDate || 
                        (item.tournaments?.startDate) || 
                        (item.tournaments?.start_date) || 
                        'TBD';
                        
                      const teamName = item.teamName || 
                        item.team_name || 
                        'Individual';
                        
                      const status = item.registrationStatus || 
                        item.status || 
                        'pending';
                      
                      return (
                        <tr key={item.id || item.registrationId} className="border-b border-gray-700">
                          <td className="py-4">
                            <Link href={`/tournaments/${tournamentId}`} className="hover:text-orange-400">
                              {tournamentName}
                            </Link>
                          </td>
                          <td className="py-4">{game}</td>
                          <td className="py-4">{typeof startDate === 'string' ? new Date(startDate).toLocaleDateString('en-IN') : startDate}</td>
                          <td className="py-4">{teamName}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              status === 'approved' ? 'bg-green-500/20 text-green-400' : 
                              status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                              status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-red-500/20 text-red-400'}`}>
                              {status ? `${status.charAt(0).toUpperCase()}${status.slice(1)}` : 'Unknown'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <svg className="h-12 w-12 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="text-lg mb-4">You haven't participated in any tournaments yet</p>
                <Link href="/tournaments" className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg">
                  Browse Tournaments
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {/* Account Settings Tab */}
        {activeTab === 'account' && (
          <motion.div 
            className="bg-gray-800 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            
            <div className="space-y-8">
              {/* Account Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Account Information</h3>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Email</label>
                      <div className="text-white">{session?.user?.email || 'Not available'}</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Member Since</label>
                      <div className="text-white">December 2023</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <button className="text-orange-400 hover:text-orange-500">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Tournament Notifications</div>
                        <div className="text-sm text-gray-400">Get notified about tournament updates</div>
                      </div>
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-gray-600">
                        <label className="absolute left-0 w-6 h-6 transition duration-100 ease-in-out rounded-full bg-white shadow cursor-pointer transform translate-x-6"></label>
                        <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-gray-400">Receive email updates</div>
                      </div>
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-gray-600">
                        <label className="absolute left-0 w-6 h-6 transition duration-100 ease-in-out rounded-full bg-white shadow cursor-pointer transform translate-x-0"></label>
                        <input type="checkbox" className="opacity-0 w-0 h-0" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Public Profile</div>
                        <div className="text-sm text-gray-400">Make your profile visible to others</div>
                      </div>
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-gray-600">
                        <label className="absolute left-0 w-6 h-6 transition duration-100 ease-in-out rounded-full bg-white shadow cursor-pointer transform translate-x-6"></label>
                        <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="text-right">
                <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tournaments Tab */}
        {activeTab === 'tournaments' && (
          <motion.div
            className="bg-gray-800 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-6">My Tournament Registrations</h2>
            
            {tournamentHistory && tournamentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tournament</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Game</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 bg-gray-700 bg-opacity-50">
                    {tournamentHistory.map((registration, index) => (
                      <tr key={registration.registrationId || index} className="hover:bg-gray-600 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div>{registration.tournamentName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {registration.game}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(registration.startDate).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {registration.teamName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            registration.registrationStatus === 'approved' ? 'bg-green-900 text-green-300' :
                            registration.registrationStatus === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                            registration.registrationStatus === 'completed' ? 'bg-blue-900 text-blue-300' :
                            'bg-red-900 text-red-300'
                          }`}>
                            {registration.registrationStatus?.charAt(0).toUpperCase() + registration.registrationStatus?.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <Link 
                            href={`/tournaments/${registration.tournamentId}`}
                            className="text-orange-400 hover:text-orange-300 mr-4"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <svg className="h-12 w-12 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-lg mb-2">No tournament registrations yet</p>
                <p className="text-sm mb-6">Register for tournaments to see them here</p>
                <Link href="/tournaments" className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg">
                  Browse Tournaments
                </Link>
              </div>
            )}
          </motion.div>
        )}
        
        {/* My Tournaments Tab */}
        {activeTab === 'tournaments' && (
          <motion.div
            className="bg-gray-800 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-6">My Tournament Registrations</h2>
            
            {tournamentHistory && tournamentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tournament</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Game</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 bg-gray-700 bg-opacity-50">
                    {tournamentHistory.map((registration, index) => (
                      <tr key={index} className="hover:bg-gray-600 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div>{registration.tournamentName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {registration.game}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(registration.startDate).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {registration.teamName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            registration.registrationStatus === 'approved' ? 'bg-green-900 text-green-300' :
                            registration.registrationStatus === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                            registration.registrationStatus === 'completed' ? 'bg-blue-900 text-blue-300' :
                            'bg-red-900 text-red-300'
                          }`}>
                            {registration.registrationStatus?.charAt(0).toUpperCase() + registration.registrationStatus?.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <Link 
                            href={`/tournaments/${registration.tournamentId}`}
                            className="text-orange-400 hover:text-orange-300 mr-4"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <svg className="h-12 w-12 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-lg mb-2">No tournament registrations yet</p>
                <p className="text-sm mb-6">Register for tournaments to see them here</p>
                <Link href="/tournaments" className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg">
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
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-6">Achievements</h2>
            
            {profile.achievements && profile.achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <svg className="h-12 w-12 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <p className="text-lg mb-2">No achievements yet</p>
                <p className="text-sm mb-6">Participate in tournaments and events to earn achievements</p>
                <Link href="/tournaments" className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg">
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