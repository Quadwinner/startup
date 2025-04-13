"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TournamentManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    game: 'valorant',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    prizePool: '',
    entryFee: '',
    maxTeams: '16',
    description: '',
  });
  const [inviteEmails, setInviteEmails] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  // Simulated mock data
  useEffect(() => {
    const mockTournaments = [
      {
        id: 1,
        name: 'Valorant Championship 2025',
        game: 'Valorant',
        startDate: '2025-05-15',
        endDate: '2025-05-20',
        registrationDeadline: '2025-05-10',
        prizePool: '₹100,000',
        entryFee: '₹1,000',
        maxTeams: 16,
        teamsRegistered: 12,
        status: 'upcoming',
      },
      {
        id: 2,
        name: 'BGMI Pro League Season 3',
        game: 'BGMI',
        startDate: '2025-06-01',
        endDate: '2025-06-10',
        registrationDeadline: '2025-05-25',
        prizePool: '₹250,000',
        entryFee: '₹1,500',
        maxTeams: 24,
        teamsRegistered: 18,
        status: 'upcoming',
      },
      {
        id: 3,
        name: 'FIFA Online Tournament',
        game: 'FIFA',
        startDate: '2025-04-05',
        endDate: '2025-04-07',
        registrationDeadline: '2025-04-03',
        prizePool: '₹50,000',
        entryFee: '₹500',
        maxTeams: 32,
        teamsRegistered: 32,
        status: 'completed',
        winner: 'TeamElite',
      },
    ];
    
    setTimeout(() => {
      setTournaments(mockTournaments);
      setIsLoading(false);
    }, 1000);
  }, []);

  // If still loading the session
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (status === 'unauthenticated') {
    router.push('/login?callbackUrl=/admin/tournaments');
    return null;
  }

  // Check if user has admin role, otherwise redirect to home
  if (session?.user?.role !== 'admin') {
    router.push('/');
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mb-4"></div>
        <p>Access denied. Redirecting to home page...</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTournament = (e) => {
    e.preventDefault();
    // In a real app, you would call an API to create the tournament
    const newTournament = {
      id: tournaments.length + 1,
      ...formData,
      teamsRegistered: 0,
      status: 'upcoming',
    };
    
    setTournaments([...tournaments, newTournament]);
    setShowCreateModal(false);
    setFormData({
      name: '',
      game: 'valorant',
      startDate: '',
      endDate: '',
      registrationDeadline: '',
      prizePool: '',
      entryFee: '',
      maxTeams: '16',
      description: '',
    });
  };

  const handleSendInvites = (e) => {
    e.preventDefault();
    // In a real app, you would call an API to send invitations
    alert(`Invitations would be sent to: ${inviteEmails}`);
    setShowInviteModal(false);
    setInviteEmails('');
    setSelectedTournament(null);
  };

  const openInviteModal = (tournament) => {
    setSelectedTournament(tournament);
    setShowInviteModal(true);
  };

  const filteredTournaments = tournaments.filter(t => 
    activeTab === 'all' || t.status === activeTab
  );

  return (
    <div className="bg-slate-900 min-h-screen text-white p-8">
      <div className="mb-8">
        <Link href="/admin" className="text-orange-400 hover:text-orange-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Admin Dashboard
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-4xl font-bold mb-4 md:mb-0">Tournament Management</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Tournament
        </button>
      </div>
      
      <div className="mb-6">
        <div className="flex space-x-2 border-b border-slate-700">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('all')}
          >
            All Tournaments
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'upcoming' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'active' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'completed' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <p className="text-xl text-gray-400 mb-4">No tournaments found in this category.</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Create Your First Tournament
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <motion.div 
              key={tournament.id}
              className="bg-slate-800 rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{tournament.name}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    tournament.status === 'upcoming' ? 'bg-blue-900 text-blue-200' :
                    tournament.status === 'active' ? 'bg-green-900 text-green-200' :
                    'bg-purple-900 text-purple-200'
                  }`}>
                    {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                  </span>
                </div>
                
                <div className="text-sm mb-6">
                  <p className="flex items-center text-gray-300 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {tournament.game}
                  </p>
                  
                  <p className="flex items-center text-gray-300 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                  </p>
                  
                  <p className="flex items-center text-gray-300 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    Prize Pool: {tournament.prizePool}
                  </p>
                  
                  <p className="flex items-center text-gray-300 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Teams: {tournament.teamsRegistered}/{tournament.maxTeams}
                  </p>
                  
                  {tournament.status === 'completed' && tournament.winner && (
                    <p className="flex items-center text-gray-300 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Winner: {tournament.winner}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2 pt-4 border-t border-slate-700">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex-1">
                    Edit
                  </button>
                  
                  {tournament.status === 'upcoming' && (
                    <button 
                      onClick={() => openInviteModal(tournament)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors flex-1"
                    >
                      Send Invites
                    </button>
                  )}
                  
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors flex-1">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Create Tournament Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
          <motion.div 
            className="bg-slate-800 rounded-lg max-w-2xl w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create Tournament</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateTournament}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tournament Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Game</label>
                  <select
                    name="game"
                    value={formData.game}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="valorant">Valorant</option>
                    <option value="csgo">CS:GO</option>
                    <option value="dota2">Dota 2</option>
                    <option value="lol">League of Legends</option>
                    <option value="bgmi">BGMI</option>
                    <option value="pubg">PUBG</option>
                    <option value="fortnite">Fortnite</option>
                    <option value="fifa">FIFA</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Registration Deadline</label>
                  <input
                    type="date"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Prize Pool</label>
                  <input
                    type="text"
                    name="prizePool"
                    value={formData.prizePool}
                    onChange={handleInputChange}
                    required
                    placeholder="₹50,000"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Entry Fee</label>
                  <input
                    type="text"
                    name="entryFee"
                    value={formData.entryFee}
                    onChange={handleInputChange}
                    required
                    placeholder="₹1,000"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Max Teams</label>
                  <select
                    name="maxTeams"
                    value={formData.maxTeams}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="8">8</option>
                    <option value="16">16</option>
                    <option value="24">24</option>
                    <option value="32">32</option>
                    <option value="64">64</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Provide a description of the tournament rules, structure, and other important details."
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  Create Tournament
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      {/* Send Invites Modal */}
      {showInviteModal && selectedTournament && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
          <motion.div 
            className="bg-slate-800 rounded-lg max-w-lg w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Send Tournament Invitations</h2>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-300">Sending invitations for: <span className="font-semibold">{selectedTournament.name}</span></p>
            </div>
            
            <form onSubmit={handleSendInvites}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">Email Addresses</label>
                <textarea
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter email addresses, separated by commas or new lines"
                  required
                ></textarea>
                <p className="text-sm text-gray-400 mt-1">Players will receive an email with tournament details and a registration link.</p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Send Invitations
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
} 