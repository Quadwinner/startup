"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function PerformancePage() {
  const [activeGame, setActiveGame] = useState('valorant');
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('ShubhamGamer'); // Default username or can be dynamic
  
  // Sample game options
  const games = [
    { id: 'valorant', name: 'Valorant' },
    { id: 'bgmi', name: 'BGMI' },
    { id: 'cod-mobile', name: 'COD Mobile' },
    { id: 'free-fire', name: 'Free Fire' },
    { id: 'fortnite', name: 'Fortnite' },
    { id: 'apex-legends', name: 'Apex Legends' }
  ];
  
  // Fetch player data from API
  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/players/${username}/statistics?game=${activeGame}`);
        setPlayerData(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching player data:', err);
        setError('Failed to load player data');
        // Fallback to sample data if API fails
        setPlayerData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [username, activeGame]);
  
  // Sample player stats for Valorant as fallback or enhanced with API data
  const valorantStats = {
    overall: {
      matches: playerData?.gameStats?.totalMatches || 150,
      winRate: playerData?.gameStats?.winRate + '%' || '58%',
      kd: playerData?.gameStats?.kda || '1.8',
      headshots: playerData?.gameStats?.headshotPercentage + '%' || '32%',
      avgScore: playerData?.gameStats?.averageScore || '245',
      mostPlayedAgent: playerData?.gameStats?.mostPlayedAgent || 'Jett',
      avgKills: playerData?.gameStats?.avgKills || '18.5',
      avgDeaths: playerData?.gameStats?.avgDeaths || '10.3',
      avgAssists: playerData?.gameStats?.avgAssists || '7.2',
      avgAcs: '235'
    },
    recentMatches: playerData?.recentMatches || [
      {
        id: 1,
        date: '2 hours ago',
        map: 'Ascent',
        mode: 'Competitive',
        result: 'Win',
        score: '13-7',
        stats: {
          kills: 24,
          deaths: 11,
          assists: 8,
          acs: 285,
          agent: 'Jett'
        }
      },
      {
        id: 2,
        date: '5 hours ago',
        map: 'Haven',
        mode: 'Competitive',
        result: 'Loss',
        score: '10-13',
        stats: {
          kills: 16,
          deaths: 14,
          assists: 9,
          acs: 215,
          agent: 'Reyna'
        }
      },
      {
        id: 3,
        date: '8 hours ago',
        map: 'Split',
        mode: 'Competitive',
        result: 'Win',
        score: '13-5',
        stats: {
          kills: 22,
          deaths: 8,
          assists: 6,
          acs: 306,
          agent: 'Jett'
        }
      },
      {
        id: 4,
        date: 'Yesterday',
        map: 'Fracture',
        mode: 'Competitive',
        result: 'Win',
        score: '13-11',
        stats: {
          kills: 19,
          deaths: 15,
          assists: 10,
          acs: 245,
          agent: 'Chamber'
        }
      },
      {
        id: 5,
        date: 'Yesterday',
        map: 'Bind',
        mode: 'Competitive',
        result: 'Loss',
        score: '3-13',
        stats: {
          kills: 9,
          deaths: 16,
          assists: 2,
          acs: 132,
          agent: 'Sage'
        }
      }
    ],
    agentStats: playerData?.agentStats?.map(agent => ({
      agent: agent.agent, 
      matches: agent.matches, 
      winRate: agent.winRate + '%', 
      kd: agent.averageKDA, 
      avgAcs: 0, 
      image: `/images/valorant/agents/${agent.agent.toLowerCase()}.png` 
    })) || [
      { 
        agent: 'Jett', 
        matches: 62, 
        winRate: '64%', 
        kd: '2.1', 
        avgAcs: 255, 
        image: '/images/valorant/agents/jett.png' 
      },
      { 
        agent: 'Reyna', 
        matches: 35, 
        winRate: '62%', 
        kd: '1.95', 
        avgAcs: 240, 
        image: '/images/valorant/agents/reyna.png' 
      },
      { 
        agent: 'Chamber', 
        matches: 28, 
        winRate: '53%', 
        kd: '1.7', 
        avgAcs: 210, 
        image: '/images/valorant/agents/chamber.png' 
      },
      { 
        agent: 'Sage', 
        matches: 15, 
        winRate: '47%', 
        kd: '1.2', 
        avgAcs: 180, 
        image: '/images/valorant/agents/sage.png' 
      },
      { 
        agent: 'Omen', 
        matches: 10, 
        winRate: '50%', 
        kd: '1.5', 
        avgAcs: 195, 
        image: '/images/valorant/agents/omen.png' 
      }
    ]
  };

  // Win history data from API or fallback
  const winHistory = playerData?.winHistory || [
    { month: 'Jan', winRate: 45 },
    { month: 'Feb', winRate: 52 },
    { month: 'Mar', winRate: 48 },
    { month: 'Apr', winRate: 55 },
    { month: 'May', winRate: 60 },
    { month: 'Jun', winRate: 58 }
  ];

  // Helper function to get most played agent
  function getMostPlayedAgent(agentStats) {
    if (!agentStats || !agentStats.length) return 'Jett';
    return agentStats.sort((a, b) => b.matches - a.matches)[0].agent;
  }

  // Helper function to calculate average kills
  function calculateAvgKills(matches) {
    if (!matches || !matches.length) return '18.5';
    const totalKills = matches.reduce((sum, match) => sum + match.kills, 0);
    return (totalKills / matches.length).toFixed(1);
  }

  // Helper function to calculate average deaths
  function calculateAvgDeaths(matches) {
    if (!matches || !matches.length) return '10.3';
    const totalDeaths = matches.reduce((sum, match) => sum + match.deaths, 0);
    return (totalDeaths / matches.length).toFixed(1);
  }

  // Helper function to calculate average assists
  function calculateAvgAssists(matches) {
    if (!matches || !matches.length) return '7.2';
    const totalAssists = matches.reduce((sum, match) => sum + match.assists, 0);
    return (totalAssists / matches.length).toFixed(1);
  }

  // Helper function to calculate ACS (Average Combat Score)
  function calculateACS(match) {
    if (!match) return 235;
    // Simple formula: (kills * 200 + assists * 50) / rounds
    const rounds = parseInt(match.score?.split('-')[0]) + parseInt(match.score?.split('-')[1]) || 20;
    return Math.round((match.kills * 200 + match.assists * 50) / rounds);
  }

  // Helper function to format date
  function formatDate(dateString) {
    if (!dateString) return '2 hours ago';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours < 1) return 'Just now';
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  // Function to get agent class color
  const getAgentClassColor = (agent) => {
    const classes = {
      'Jett': 'bg-blue-500',
      'Reyna': 'bg-purple-500',
      'Chamber': 'bg-yellow-500',
      'Sage': 'bg-green-500',
      'Omen': 'bg-indigo-500'
    };
    return classes[agent] || 'bg-gray-500';
  };

  // Function to get result color
  const getResultColor = (result) => {
    return result === 'Win' ? 'text-green-400' : 'text-red-400';
  };

  // Display loading state
  if (loading) {
    return (
      <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">Loading performance data...</div>
      </div>
    );
  }

  // Display error state but continue with fallback data
  const errorBanner = error ? (
    <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6">
      <p>{error} - Showing sample data instead</p>
    </div>
  ) : null;

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      {errorBanner}
      
      {/* Hero Section */}
      <section className="relative py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-8 md:mb-0">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                Performance Tracker
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Track your in-game performance, analyze your stats, and improve your gameplay across multiple titles
              </motion.p>
            </div>
            <div className="md:w-1/3">
              <motion.div 
                className="bg-slate-700 p-4 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center mb-2">
                  <div className="h-12 w-12 bg-slate-600 rounded-full mr-3 flex items-center justify-center text-2xl font-bold">
                    {playerData?.username?.[0]?.toUpperCase() || 'S'}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{playerData?.displayName || playerData?.username || 'ShubhamGamer'}</div>
                    <div className="text-gray-400 text-sm">{playerData?.gameStats?.rank || 'Diamond 2'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-800 p-2 rounded">
                    <div className="text-gray-400 text-xs">Matches</div>
                    <div className="font-bold">{valorantStats.overall.matches}</div>
                  </div>
                  <div className="bg-slate-800 p-2 rounded">
                    <div className="text-gray-400 text-xs">Win Rate</div>
                    <div className="font-bold">{valorantStats.overall.winRate}</div>
                  </div>
                  <div className="bg-slate-800 p-2 rounded">
                    <div className="text-gray-400 text-xs">K/D</div>
                    <div className="font-bold">{valorantStats.overall.kd}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <Link 
                    href={`/profile/${username}`}
                    className="block text-center bg-orange-500 hover:bg-orange-600 text-white p-2 rounded transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Game Selection */}
      <section className="py-6 bg-slate-800 border-t border-b border-slate-700 sticky top-16 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide space-x-4">
            {games.map(game => (
              <button 
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className={`px-6 py-2 rounded-full transition-colors whitespace-nowrap ${activeGame === game.id ? 'bg-orange-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
              >
                {game.name}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      {activeGame === 'valorant' && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Overall Stats */}
            <motion.div 
              className="bg-slate-800 rounded-lg p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6">Overall Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-slate-700 p-4 rounded">
                  <div className="text-gray-400 text-sm">Win Rate</div>
                  <div className="text-2xl font-bold">{valorantStats.overall.winRate}</div>
                </div>
                <div className="bg-slate-700 p-4 rounded">
                  <div className="text-gray-400 text-sm">K/D Ratio</div>
                  <div className="text-2xl font-bold">{valorantStats.overall.kd}</div>
                </div>
                <div className="bg-slate-700 p-4 rounded">
                  <div className="text-gray-400 text-sm">Headshot %</div>
                  <div className="text-2xl font-bold">{valorantStats.overall.headshots}</div>
                </div>
                <div className="bg-slate-700 p-4 rounded">
                  <div className="text-gray-400 text-sm">Avg. Score</div>
                  <div className="text-2xl font-bold">{valorantStats.overall.avgScore}</div>
                </div>
                <div className="bg-slate-700 p-4 rounded">
                  <div className="text-gray-400 text-sm">Most Played</div>
                  <div className="text-2xl font-bold">{valorantStats.overall.mostPlayedAgent}</div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Detailed Stats</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-700 p-3 rounded">
                      <div className="text-gray-400 text-xs">Avg. Kills</div>
                      <div className="font-bold">{valorantStats.overall.avgKills}</div>
                    </div>
                    <div className="bg-slate-700 p-3 rounded">
                      <div className="text-gray-400 text-xs">Avg. Deaths</div>
                      <div className="font-bold">{valorantStats.overall.avgDeaths}</div>
                    </div>
                    <div className="bg-slate-700 p-3 rounded">
                      <div className="text-gray-400 text-xs">Avg. Assists</div>
                      <div className="font-bold">{valorantStats.overall.avgAssists}</div>
                    </div>
                    <div className="bg-slate-700 p-3 rounded col-span-3">
                      <div className="text-gray-400 text-xs">Avg. Combat Score</div>
                      <div className="font-bold">{valorantStats.overall.avgAcs}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Win Rate Trend</h3>
                  <div className="bg-slate-700 p-3 rounded h-36 flex items-end justify-between">
                    {winHistory.map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="w-8 bg-orange-500 rounded-t" style={{ height: `${item.winRate}%` }}></div>
                        <div className="text-gray-400 text-xs mt-1">{item.month}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Recent Matches */}
            <motion.div 
              className="bg-slate-800 rounded-lg p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-6">Recent Matches</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-400 text-sm border-b border-slate-700">
                      <th className="text-left pb-2">Match</th>
                      <th className="text-left pb-2">Map</th>
                      <th className="text-left pb-2">Result</th>
                      <th className="text-left pb-2">K/D/A</th>
                      <th className="text-left pb-2">ACS</th>
                      <th className="text-left pb-2">Agent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {valorantStats.recentMatches.map(match => (
                      <tr key={match.id} className="border-b border-slate-700 hover:bg-slate-700 transition-colors">
                        <td className="py-3">
                          <div>{match.mode}</div>
                          <div className="text-gray-400 text-xs">{match.date}</div>
                        </td>
                        <td>{match.map}</td>
                        <td>
                          <span className={getResultColor(match.result)}>
                            {match.result} {match.score}
                          </span>
                        </td>
                        <td>{match.stats.kills}/{match.stats.deaths}/{match.stats.assists}</td>
                        <td>{match.stats.acs}</td>
                        <td>
                          <div className={`inline-block px-2 py-1 rounded text-xs ${getAgentClassColor(match.stats.agent)}`}>
                            {match.stats.agent}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <Link 
                  href="/performance/valorant/history"
                  className="text-orange-400 hover:text-orange-500 transition-colors inline-flex items-center"
                >
                  View Complete Match History
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>
            
            {/* Agent Performance */}
            <motion.div 
              className="bg-slate-800 rounded-lg p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6">Agent Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {valorantStats.agentStats.map((agent, index) => (
                  <motion.div 
                    key={agent.agent}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="bg-slate-700 p-4 rounded flex flex-col"
                  >
                    <div className="mb-3 flex items-center">
                      <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center mr-3 overflow-hidden">
                        <Image 
                          src={agent.image}
                          alt={agent.agent}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          unoptimized={true}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/default-agent.png';
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-bold">{agent.agent}</div>
                        <div className="text-xs text-gray-400">{agent.matches} matches</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <div className="bg-slate-600 p-2 rounded text-center">
                        <div className="text-xs text-gray-400">Win Rate</div>
                        <div className="font-bold">{agent.winRate}</div>
                      </div>
                      <div className="bg-slate-600 p-2 rounded text-center">
                        <div className="text-xs text-gray-400">K/D</div>
                        <div className="font-bold">{agent.kd}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Premium Upgrade Prompt */}
            <motion.div 
              className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg p-6 mb-8 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-2xl font-bold mb-2">Upgrade to Premium</h2>
                  <p className="text-white/80 max-w-xl">
                    Get access to advanced statistics, performance predictions, and personalized improvement suggestions based on your gameplay.
                  </p>
                </div>
                <div>
                  <Link 
                    href="/pricing"
                    className="inline-block bg-white text-orange-600 hover:bg-orange-100 transition-colors font-bold px-6 py-3 rounded-lg"
                  >
                    Upgrade Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}
      
      {activeGame !== 'valorant' && (
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4">Coming Soon!</h2>
              <p className="text-gray-400 text-lg mb-8">
                We're currently working on adding detailed statistics for {games.find(g => g.id === activeGame)?.name || activeGame}.
              </p>
              <p className="text-orange-400">
                Check back later for updates or subscribe to our newsletter to get notified.
              </p>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
} 