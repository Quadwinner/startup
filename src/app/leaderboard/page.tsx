"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
  const [activeGame, setActiveGame] = useState('valorant');
  
  const games = [
    { id: 'valorant', name: 'Valorant' },
    { id: 'csgo', name: 'CS:GO' },
    { id: 'fortnite', name: 'Fortnite' },
    { id: 'lol', name: 'League of Legends' },
    { id: 'dota2', name: 'Dota 2' }
  ];
  
  // Sample leaderboard data
  const leaderboardData = {
    valorant: [
      { rank: 1, player: 'SkyShadow', avatar: '/avatars/player1.png', score: 9850, winRate: 72, kills: 2456, matches: 342 },
      { rank: 2, player: 'NightHawk', avatar: '/avatars/player2.png', score: 9720, winRate: 68, kills: 2378, matches: 335 },
      { rank: 3, player: 'PhoenixFlame', avatar: '/avatars/player3.png', score: 9540, winRate: 65, kills: 2289, matches: 320 },
      { rank: 4, player: 'VoidWalker', avatar: '/avatars/player4.png', score: 9320, winRate: 64, kills: 2176, matches: 312 },
      { rank: 5, player: 'SteelNerve', avatar: '/avatars/player5.png', score: 9240, winRate: 63, kills: 2154, matches: 305 },
      { rank: 6, player: 'ToxicRain', avatar: '/avatars/player6.png', score: 9150, winRate: 61, kills: 2090, matches: 298 },
      { rank: 7, player: 'FrostBite', avatar: '/avatars/player7.png', score: 9080, winRate: 60, kills: 2042, matches: 290 },
      { rank: 8, player: 'ShadowBlade', avatar: '/avatars/player8.png', score: 8950, winRate: 59, kills: 2010, matches: 285 },
      { rank: 9, player: 'DeadEye', avatar: '/avatars/player9.png', score: 8820, winRate: 58, kills: 1980, matches: 280 },
      { rank: 10, player: 'ElectricFist', avatar: '/avatars/player10.png', score: 8740, winRate: 57, kills: 1945, matches: 276 },
    ],
    csgo: [
      { rank: 1, player: 'HeadshotKing', avatar: '/avatars/player3.png', score: 10250, winRate: 75, kills: 3150, matches: 420 },
      { rank: 2, player: 'AimGod', avatar: '/avatars/player8.png', score: 10120, winRate: 73, kills: 3080, matches: 415 },
      { rank: 3, player: 'FlickMaster', avatar: '/avatars/player2.png', score: 9980, winRate: 71, kills: 2995, matches: 408 },
      { rank: 4, player: 'SprayControl', avatar: '/avatars/player7.png', score: 9850, winRate: 70, kills: 2920, matches: 402 },
      { rank: 5, player: 'ClutchKing', avatar: '/avatars/player1.png', score: 9720, winRate: 68, kills: 2865, matches: 395 },
      { rank: 6, player: 'BombPlanter', avatar: '/avatars/player5.png', score: 9590, winRate: 67, kills: 2810, matches: 390 },
      { rank: 7, player: 'AWPer', avatar: '/avatars/player4.png', score: 9480, winRate: 66, kills: 2750, matches: 385 },
      { rank: 8, player: 'RifleGod', avatar: '/avatars/player10.png', score: 9350, winRate: 65, kills: 2695, matches: 380 },
      { rank: 9, player: 'NadeKing', avatar: '/avatars/player6.png', score: 9240, winRate: 64, kills: 2640, matches: 375 },
      { rank: 10, player: 'PistolMaster', avatar: '/avatars/player9.png', score: 9130, winRate: 63, kills: 2585, matches: 370 },
    ],
    fortnite: [
      { rank: 1, player: 'BuildMaster', avatar: '/avatars/player5.png', score: 11850, winRate: 82, kills: 4256, matches: 520 },
      { rank: 2, player: 'BoxFighter', avatar: '/avatars/player1.png', score: 11720, winRate: 80, kills: 4178, matches: 510 },
      { rank: 3, player: 'StormSurvivor', avatar: '/avatars/player7.png', score: 11540, winRate: 78, kills: 4089, matches: 500 },
      { rank: 4, player: 'HighGrounder', avatar: '/avatars/player3.png', score: 11320, winRate: 76, kills: 3976, matches: 490 },
      { rank: 5, player: 'EditGod', avatar: '/avatars/player9.png', score: 11240, winRate: 75, kills: 3854, matches: 485 },
      { rank: 6, player: 'TilterTowers', avatar: '/avatars/player2.png', score: 11150, winRate: 74, kills: 3790, matches: 480 },
      { rank: 7, player: 'SniperElite', avatar: '/avatars/player6.png', score: 11080, winRate: 73, kills: 3742, matches: 475 },
      { rank: 8, player: 'PumpShot', avatar: '/avatars/player10.png', score: 10950, winRate: 72, kills: 3710, matches: 470 },
      { rank: 9, player: 'RiftRaider', avatar: '/avatars/player4.png', score: 10820, winRate: 71, kills: 3680, matches: 465 },
      { rank: 10, player: 'BattlePass', avatar: '/avatars/player8.png', score: 10740, winRate: 70, kills: 3645, matches: 460 },
    ],
    lol: [
      { rank: 1, player: 'LaneDominator', avatar: '/avatars/player2.png', score: 9050, winRate: 68, kills: 2156, matches: 312 },
      { rank: 2, player: 'JungleKing', avatar: '/avatars/player7.png', score: 8920, winRate: 67, kills: 2078, matches: 305 },
      { rank: 3, player: 'MidLaner', avatar: '/avatars/player1.png', score: 8840, winRate: 66, kills: 1989, matches: 300 },
      { rank: 4, player: 'ADCarry', avatar: '/avatars/player9.png', score: 8720, winRate: 65, kills: 1876, matches: 292 },
      { rank: 5, player: 'SupportGod', avatar: '/avatars/player3.png', score: 8640, winRate: 64, kills: 1754, matches: 285 },
      { rank: 6, player: 'TeamFighter', avatar: '/avatars/player6.png', score: 8550, winRate: 63, kills: 1690, matches: 280 },
      { rank: 7, player: 'ObjectiveSecurer', avatar: '/avatars/player10.png', score: 8480, winRate: 62, kills: 1642, matches: 275 },
      { rank: 8, player: 'VisionWard', avatar: '/avatars/player4.png', score: 8350, winRate: 61, kills: 1610, matches: 270 },
      { rank: 9, player: 'PentaKill', avatar: '/avatars/player8.png', score: 8220, winRate: 60, kills: 1580, matches: 265 },
      { rank: 10, player: 'ChampionPool', avatar: '/avatars/player5.png', score: 8140, winRate: 59, kills: 1545, matches: 260 },
    ],
    dota2: [
      { rank: 1, player: 'AncientDestroyer', avatar: '/avatars/player8.png', score: 9750, winRate: 70, kills: 2856, matches: 402 },
      { rank: 2, player: 'CarryPlayer', avatar: '/avatars/player3.png', score: 9620, winRate: 69, kills: 2778, matches: 395 },
      { rank: 3, player: 'MidOrFeed', avatar: '/avatars/player5.png', score: 9540, winRate: 68, kills: 2689, matches: 390 },
      { rank: 4, player: 'OfflaneGod', avatar: '/avatars/player1.png', score: 9420, winRate: 67, kills: 2576, matches: 382 },
      { rank: 5, player: 'SupportHero', avatar: '/avatars/player10.png', score: 9340, winRate: 66, kills: 2454, matches: 375 },
      { rank: 6, player: 'WardMaster', avatar: '/avatars/player4.png', score: 9250, winRate: 65, kills: 2390, matches: 370 },
      { rank: 7, player: 'RoshanSlayer', avatar: '/avatars/player7.png', score: 9180, winRate: 64, kills: 2342, matches: 365 },
      { rank: 8, player: 'GankSquad', avatar: '/avatars/player2.png', score: 9050, winRate: 63, kills: 2310, matches: 360 },
      { rank: 9, player: 'UltiWielder', avatar: '/avatars/player9.png', score: 8920, winRate: 62, kills: 2280, matches: 355 },
      { rank: 10, player: 'TechiesPicker', avatar: '/avatars/player6.png', score: 8840, winRate: 61, kills: 2245, matches: 350 },
    ]
  };
  
  // The current game's leaderboard
  const currentLeaderboard = leaderboardData[activeGame] || [];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-orange-500">
        EpicEsports Leaderboard
      </h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Select Game</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {games.map(game => (
            <button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              className={`px-6 py-3 rounded-full transition-all ${
                activeGame === game.id 
                  ? 'bg-orange-500 text-white font-bold' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {game.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white capitalize">
            {activeGame} Top Players
          </h2>
          <div className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
        
        {/* Table header */}
        <div className="hidden md:grid grid-cols-12 gap-4 mb-4 px-4 py-2 bg-gray-800 rounded-lg text-gray-400 font-medium">
          <div className="col-span-1">Rank</div>
          <div className="col-span-4">Player</div>
          <div className="col-span-2 text-right">Score</div>
          <div className="col-span-2 text-right">Win Rate</div>
          <div className="col-span-2 text-right">Kills</div>
          <div className="col-span-1 text-right">Matches</div>
        </div>
        
        {/* Leaderboard list */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {currentLeaderboard.map((player) => (
            <motion.div
              key={player.rank}
              variants={itemVariants}
              className={`grid grid-cols-3 md:grid-cols-12 gap-4 p-4 rounded-lg items-center ${
                player.rank === 1 
                  ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-600/20 border border-yellow-500/50' 
                  : player.rank === 2 
                    ? 'bg-gradient-to-r from-gray-800/50 to-gray-600/20 border border-gray-400/50' 
                    : player.rank === 3 
                      ? 'bg-gradient-to-r from-amber-900/30 to-amber-800/20 border border-amber-700/50'
                      : 'bg-gray-800 hover:bg-gray-750'
              }`}
            >
              {/* Rank */}
              <div className="col-span-1 flex items-center justify-center md:justify-start">
                <span className={`
                  w-8 h-8 flex items-center justify-center rounded-full font-bold
                  ${player.rank === 1 ? 'bg-yellow-500 text-black' : 
                    player.rank === 2 ? 'bg-gray-400 text-black' : 
                    player.rank === 3 ? 'bg-amber-700 text-white' : 
                    'bg-gray-700 text-white'}
                `}>
                  {player.rank}
                </span>
              </div>
              
              {/* Player */}
              <div className="col-span-2 md:col-span-4 flex items-center">
                <div className="relative w-10 h-10 mr-3 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-purple-600/30" />
                  <span className="text-white font-bold text-sm">{player.player.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-bold text-white">{player.player}</div>
                  <div className="text-xs text-gray-400">Pro Player</div>
                </div>
              </div>
              
              {/* Stats (only visible on md and larger) */}
              <div className="hidden md:block md:col-span-2 text-right">
                <span className="text-orange-400 font-bold">{player.score.toLocaleString()}</span>
              </div>
              <div className="hidden md:block md:col-span-2 text-right">
                <span className="text-green-400">{player.winRate}%</span>
              </div>
              <div className="hidden md:block md:col-span-2 text-right">
                <span className="text-blue-400">{player.kills.toLocaleString()}</span>
              </div>
              <div className="hidden md:block md:col-span-1 text-right">
                <span className="text-gray-300">{player.matches}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Regional filters and season selector would go here */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <span className="text-gray-400 mr-2">Region:</span>
            <select className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-1">
              <option>Global</option>
              <option>Asia Pacific</option>
              <option>North America</option>
              <option>Europe</option>
              <option>South America</option>
            </select>
          </div>
          
          <div>
            <span className="text-gray-400 mr-2">Season:</span>
            <select className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-1">
              <option>Season 5 (Current)</option>
              <option>Season 4</option>
              <option>Season 3</option>
              <option>Season 2</option>
              <option>Season 1</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Additional information */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-orange-500 mb-4">How Rankings Work</h3>
          <p className="text-gray-300 mb-4">
            Our leaderboard rankings are calculated based on a proprietary algorithm that takes into account:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Match performance (kills, assists, objectives)</li>
            <li>Win rate percentage</li>
            <li>Level of competition</li>
            <li>Consistency across matches</li>
            <li>Participation in official tournaments</li>
          </ul>
          <p className="text-gray-400 mt-4 text-sm">
            Rankings are updated daily. Only players who have completed at least 50 matches in the current season are eligible.
          </p>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-orange-500 mb-4">Upcoming Tournaments</h3>
          <div className="space-y-4">
            {[
              { name: 'EpicEsports Summer Championship', date: 'July 15-17, 2023', prize: '$50,000', game: 'Valorant' },
              { name: 'Pro League Season 6', date: 'August 5-30, 2023', prize: '$100,000', game: 'CS:GO' },
              { name: 'Battle Royale Invitational', date: 'September 10-12, 2023', prize: '$75,000', game: 'Fortnite' },
            ].map((tournament, index) => (
              <div key={index} className="border-b border-gray-800 pb-3 last:border-0">
                <div className="font-bold text-white">{tournament.name}</div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{tournament.date}</span>
                  <span className="text-green-400">{tournament.prize}</span>
                </div>
                <div className="text-xs text-orange-400 mt-1">{tournament.game}</div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors">
            View All Tournaments
          </button>
        </div>
      </div>
    </main>
  );
} 