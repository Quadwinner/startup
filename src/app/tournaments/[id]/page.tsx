"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import TournamentRegistrationForm from '@/components/TournamentRegistrationForm';

// Tournament type definition
type Tournament = {
  _id: string;
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
    contact: string;
  };
  description: string;
  rules: string;
  prizes: {
    position: number;
    reward: string;
  }[];
  schedule: {
    stage: string;
    date: string;
    details: string;
  }[];
  registrationFee: number;
  streamLink?: string;
};

export default function TournamentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isFallbackData, setIsFallbackData] = useState(false);
  
  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/tournaments/${id}`);
        setTournament(response.data.tournament);
        
        // Check if this is fallback data
        if (response.data.isFallback) {
          setIsFallbackData(true);
          setError(response.data.error || 'Showing sample data');
        } else {
          setIsFallbackData(false);
          setError(null);
        }
      } catch (err: any) {
        console.error('Error fetching tournament:', err);
        setError(err.response?.data?.error || 'Failed to load tournament details');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchTournament();
    }
  }, [id]);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
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
  
  const getRegistrationStatus = () => {
    if (!tournament) return { text: 'Loading...', color: 'text-gray-400', canRegister: false };
    
    if (tournament.status === 'completed') {
      return { text: 'Tournament Ended', color: 'text-gray-400', canRegister: false };
    }
    
    if (tournament.status === 'ongoing') {
      return { text: 'In Progress', color: 'text-green-400', canRegister: false };
    }
    
    if (tournament.currentTeams >= tournament.maxTeams) {
      return { text: 'Registration Closed (Full)', color: 'text-red-400', canRegister: false };
    }
    
    if (new Date() > new Date(tournament.registrationDeadline)) {
      return { text: 'Registration Closed', color: 'text-red-400', canRegister: false };
    }
    
    return { 
      text: `Registration Open (${tournament.currentTeams}/${tournament.maxTeams} teams)`, 
      color: 'text-green-400',
      canRegister: true
    };
  };
  
  const handleRegisterClick = () => {
    if (!session) {
      // Redirect to login page if not authenticated
      router.push(`/login?redirect=/tournaments/${id}`);
      return;
    }
    
    // Show registration form
    setShowRegistrationForm(true);
  };
  
  const handleRegistrationSuccess = () => {
    setShowRegistrationForm(false);
    setRegistrationSuccess(true);
    
    // Refresh tournament data to show updated team count
    if (id) {
      setTimeout(async () => {
        try {
          const response = await axios.get(`/api/tournaments/${id}`);
          setTournament(response.data.tournament);
        } catch (err) {
          console.error('Error refreshing tournament data:', err);
        }
      }, 1000);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading tournament details...</div>
      </div>
    );
  }
  
  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl text-red-400">
          Tournament not found
          <div className="mt-4">
            <Link href="/tournaments" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md">
              Back to Tournaments
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const registrationStatus = getRegistrationStatus();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Fallback data warning banner */}
      {isFallbackData && (
        <div className="fixed top-0 inset-x-0 z-50 bg-yellow-600 text-white p-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error || 'Showing sample tournament data. This is not a real tournament.'}</span>
            </div>
            <div>
              <Link href="/tournaments" className="bg-white text-yellow-600 px-4 py-1 rounded-md text-sm font-medium hover:bg-gray-100">
                Back to Tournaments
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Registration success notification */}
      {registrationSuccess && (
        <div className="fixed top-0 inset-x-0 z-50 bg-green-500 text-white p-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Registration successful! Your team has been registered for the tournament.</span>
            </div>
            <button 
              onClick={() => setRegistrationSuccess(false)}
              className="text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Tournament Header */}
      <div className="relative bg-gray-800 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Tournament Image */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="relative h-48 md:h-64 w-full rounded-lg overflow-hidden border-2 border-gray-700">
                <Image 
                  src={tournament.gameImage || "/images/other-games.jpg"}
                  alt={tournament.game}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Tournament Info */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(tournament.status)}`}>
                  {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                </span>
                <span className="px-3 py-1 text-sm font-semibold bg-gray-700 rounded-full">
                  {tournament.game}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{tournament.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-400">Organized by</span>
                <span className="font-semibold flex items-center">
                  {tournament.organizer.name}
                  {tournament.organizer.verified && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Start Date</p>
                  <p className="font-semibold">{formatDate(tournament.startDate)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">End Date</p>
                  <p className="font-semibold">{formatDate(tournament.endDate)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Registration Deadline</p>
                  <p className="font-semibold">{formatDate(tournament.registrationDeadline)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="font-semibold">{tournament.location}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">Prize Pool</p>
                  <p className="text-2xl font-bold text-orange-400">{tournament.prizePool}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">Team Size</p>
                  <p className="text-2xl font-bold">{tournament.teamSize} players</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">Registration Fee</p>
                  <p className="text-2xl font-bold">
                    {tournament.registrationFee > 0 ? `₹${tournament.registrationFee}` : 'FREE'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className={`text-lg ${registrationStatus.color}`}>
                  {registrationStatus.text}
                </div>
                
                {registrationStatus.canRegister && (
                  <button
                    onClick={handleRegisterClick}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
                  >
                    Register Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-t border-b border-gray-700 sticky top-16 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide space-x-8">
            <button 
              className={`py-4 border-b-2 font-medium ${activeTab === 'overview' ? 'border-orange-500 text-orange-500' : 'border-transparent hover:border-gray-600'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`py-4 border-b-2 font-medium ${activeTab === 'rules' ? 'border-orange-500 text-orange-500' : 'border-transparent hover:border-gray-600'}`}
              onClick={() => setActiveTab('rules')}
            >
              Rules
            </button>
            <button 
              className={`py-4 border-b-2 font-medium ${activeTab === 'schedule' ? 'border-orange-500 text-orange-500' : 'border-transparent hover:border-gray-600'}`}
              onClick={() => setActiveTab('schedule')}
            >
              Schedule
            </button>
            <button 
              className={`py-4 border-b-2 font-medium ${activeTab === 'prizes' ? 'border-orange-500 text-orange-500' : 'border-transparent hover:border-gray-600'}`}
              onClick={() => setActiveTab('prizes')}
            >
              Prizes
            </button>
          </div>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Tournament Overview</h2>
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="whitespace-pre-line">{tournament.description}</p>
            </div>
          </div>
        )}
        
        {activeTab === 'rules' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Tournament Rules</h2>
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="whitespace-pre-line">{tournament.rules}</p>
            </div>
          </div>
        )}
        
        {activeTab === 'schedule' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Tournament Schedule</h2>
            {tournament.schedule && tournament.schedule.length > 0 ? (
              <div className="space-y-4">
                {tournament.schedule.map((item, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">{item.stage}</h3>
                      <span className="text-gray-400">{formatDate(item.date)}</span>
                    </div>
                    <p className="mt-2 text-gray-300">{item.details}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Schedule will be posted soon.</p>
            )}
          </div>
        )}
        
        {activeTab === 'prizes' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Prize Distribution</h2>
            {tournament.prizes && tournament.prizes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tournament.prizes.map((prize, index) => (
                  <div 
                    key={index} 
                    className={`bg-gray-800 border rounded-lg p-6 text-center ${
                      prize.position === 1 ? 'border-yellow-500' : 
                      prize.position === 2 ? 'border-gray-400' : 
                      prize.position === 3 ? 'border-amber-700' : 
                      'border-gray-700'
                    }`}
                  >
                    <div className={`text-xl font-bold mb-2 ${
                      prize.position === 1 ? 'text-yellow-500' : 
                      prize.position === 2 ? 'text-gray-400' : 
                      prize.position === 3 ? 'text-amber-700' : 
                      'text-white'
                    }`}>
                      {prize.position === 1 ? '1st Place' : 
                       prize.position === 2 ? '2nd Place' : 
                       prize.position === 3 ? '3rd Place' : 
                       `${prize.position}th Place`}
                    </div>
                    <div className="text-2xl font-bold">{prize.reward}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Prize information will be posted soon.</p>
            )}
          </div>
        )}
      </div>
      
      {/* Contact Section */}
      <div className="bg-gray-800 py-8 mt-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Contact Tournament Organizer</h2>
          <p className="mb-4">
            If you have any questions about this tournament, please contact the organizer:
          </p>
          <div className="bg-gray-700 p-4 rounded-lg inline-block">
            <div className="font-semibold">{tournament.organizer.name}</div>
            <div className="text-gray-300">{tournament.organizer.contact}</div>
          </div>
        </div>
      </div>
      
      {/* Registration Form Modal */}
      {showRegistrationForm && tournament && (
        <TournamentRegistrationForm 
          tournament={tournament}
          onClose={() => setShowRegistrationForm(false)}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
} 