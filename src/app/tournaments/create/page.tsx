"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function CreateTournamentPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    game: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    description: '',
    rules: '',
    prizePool: '',
    teamSize: '1',
    maxTeams: '',
    currentTeams: 0,
    location: '',
    format: 'single-elimination',
    registrationFee: '0',
    bannerImage: null,
    isPublic: true,
    status: 'upcoming',
    organizer: {
      name: '',
      verified: false,
      contact: ''
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Check if user is logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/tournaments/create');
    } else if (status === 'authenticated' && session?.user) {
      // Prefill organizer name with user's name if available
      setFormData(prev => ({
        ...prev,
        organizer: {
          ...prev.organizer,
          name: session.user.name || '',
          contact: session.user.email || ''
        }
      }));
    }
  }, [status, session, router]);

  const gameOptions = [
    { value: 'valorant', label: 'Valorant' },
    { value: 'bgmi', label: 'BGMI' },
    { value: 'csgo', label: 'Counter-Strike 2' },
    { value: 'dota2', label: 'Dota 2' },
    { value: 'lol', label: 'League of Legends' },
    { value: 'fortnite', label: 'Fortnite' },
    { value: 'apex', label: 'Apex Legends' },
    { value: 'other', label: 'Other' }
  ];

  const formatOptions = [
    { value: 'single-elimination', label: 'Single Elimination' },
    { value: 'double-elimination', label: 'Double Elimination' },
    { value: 'round-robin', label: 'Round Robin' },
    { value: 'swiss', label: 'Swiss System' },
    { value: 'custom', label: 'Custom Format' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else if (name.includes('.')) {
      // Handle nested objects like organizer.name
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Tournament name is required';
    if (!formData.game) newErrors.game = 'Game selection is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (!formData.registrationDeadline) newErrors.registrationDeadline = 'Registration deadline is required';
    if (formData.registrationDeadline && formData.startDate && new Date(formData.registrationDeadline) > new Date(formData.startDate)) {
      newErrors.registrationDeadline = 'Registration deadline must be before start date';
    }
    if (!formData.description.trim()) newErrors.description = 'Tournament description is required';
    if (!formData.prizePool.trim()) newErrors.prizePool = 'Prize pool information is required';
    if (!formData.maxTeams) newErrors.maxTeams = 'Maximum number of teams is required';
    if (parseInt(formData.maxTeams) < 2) newErrors.maxTeams = 'At least 2 teams are required';
    if (!formData.organizer.name.trim()) newErrors['organizer.name'] = 'Organizer name is required';
    if (!formData.organizer.contact.trim()) newErrors['organizer.contact'] = 'Organizer contact information is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    setErrorDetails(null);
    
    try {
      // Format the data for API
      const tournamentData = {
        ...formData,
        teamSize: parseInt(formData.teamSize),
        maxTeams: parseInt(formData.maxTeams),
        registrationFee: parseInt(formData.registrationFee) || 0,
        // Set default game image based on game type
        gameImage: `/images/${formData.game}.jpg`
      };
      
      // Add empty structures for prizes and schedule if not present
      if (!('prizes' in tournamentData)) {
        tournamentData.prizes = [
          { position: 1, reward: formData.prizePool }
        ];
      }
      
      if (!('schedule' in tournamentData)) {
        tournamentData.schedule = [
          { 
            stage: 'Tournament Start', 
            date: formData.startDate,
            details: 'Tournament begins'
          },
          { 
            stage: 'Finals', 
            date: formData.endDate,
            details: 'Tournament finals'
          }
        ];
      }
      
      // Make API call to create tournament
      const response = await axios.post('/api/tournaments', tournamentData);
      
      if (response.data && response.data.tournament) {
        // Success - get the ID of the new tournament
        const tournamentId = response.data.tournament.id;
        console.log('Created tournament with ID:', tournamentId);
        
        setSuccessMessage('Tournament created successfully! Redirecting to tournament page...');
        
        // Redirect to the new tournament page
        setTimeout(() => {
          if (tournamentId) {
            router.push(`/tournaments/${tournamentId}`);
          } else {
            // Fallback to tournaments list if ID is missing
            console.error('Tournament ID is missing in response:', response.data);
            router.push('/tournaments');
          }
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error creating tournament:', error);
      
      // Extract detailed error information if available
      if (error.response?.data?.details) {
        setErrorDetails(error.response.data.details);
      }
      
      // If we have validation errors, set them in the form
      if (error.response?.data?.validationErrors) {
        const validationErrors = error.response.data.validationErrors;
        setErrors(prev => ({
          ...prev,
          ...validationErrors
        }));
      } else {
        // Set general error message
        setErrors(prev => ({
          ...prev,
          form: error.response?.data?.error || 'Failed to create tournament. Please try again.'
        }));
      }
      
      // Scroll to error message
      setTimeout(() => {
        const errorElement = document.querySelector('.error-message') || document.querySelector('.bg-red-500');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If not authenticated or still loading, show loading state
  if (status === 'loading' || (status === 'unauthenticated')) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Create a Tournament
            </motion.h1>
            <motion.p 
              className="text-gray-300 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Fill in the details below to organize your own esports tournament
            </motion.p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {successMessage ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500 text-white p-4 rounded-md mb-8 text-center"
              >
                {successMessage}
              </motion.div>
            ) : (
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleSubmit}
                className="bg-slate-800 rounded-lg p-8 shadow-lg"
              >
                {errors.form && (
                  <div className="bg-red-500 text-white p-4 rounded-md mb-6">
                    <p className="font-bold">Error:</p>
                    <p>{errors.form}</p>
                    {errorDetails && (
                      <p className="mt-2 text-sm border-t border-red-400 pt-2">{errorDetails}</p>
                    )}
                  </div>
                )}

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 border-b border-slate-700 pb-2">Basic Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="name">
                        Tournament Name*
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full bg-slate-700 border ${errors.name ? 'border-red-500' : 'border-slate-600'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                      {errors.name && <p className="text-red-500 mt-1 text-sm error-message">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="game">
                        Game*
                      </label>
                      <select
                        id="game"
                        name="game"
                        value={formData.game}
                        onChange={handleChange}
                        className={`w-full bg-slate-700 border ${errors.game ? 'border-red-500' : 'border-slate-600'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      >
                        <option value="">Select a game</option>
                        {gameOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.game && <p className="text-red-500 mt-1 text-sm error-message">{errors.game}</p>}
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 border-b border-slate-700 pb-2">Tournament Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="startDate">
                        Start Date*
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className={`w-full bg-slate-700 border ${errors.startDate ? 'border-red-500' : 'border-slate-600'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                      {errors.startDate && <p className="text-red-500 mt-1 text-sm error-message">{errors.startDate}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="endDate">
                        End Date*
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className={`w-full bg-slate-700 border ${errors.endDate ? 'border-red-500' : 'border-slate-600'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                      {errors.endDate && <p className="text-red-500 mt-1 text-sm error-message">{errors.endDate}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="registrationDeadline">
                        Registration Deadline*
                      </label>
                      <input
                        type="date"
                        id="registrationDeadline"
                        name="registrationDeadline"
                        value={formData.registrationDeadline}
                        onChange={handleChange}
                        className={`w-full bg-slate-700 border ${errors.registrationDeadline ? 'border-red-500' : 'border-slate-600'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                      {errors.registrationDeadline && <p className="text-red-500 mt-1 text-sm error-message">{errors.registrationDeadline}</p>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-300 mb-2" htmlFor="description">
                      Tournament Description*
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full bg-slate-700 border ${errors.description ? 'border-red-500' : 'border-slate-600'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="Provide a detailed description of your tournament..."
                    ></textarea>
                    {errors.description && <p className="text-red-500 mt-1 text-sm error-message">{errors.description}</p>}
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-300 mb-2" htmlFor="rules">
                      Tournament Rules
                    </label>
                    <textarea
                      id="rules"
                      name="rules"
                      value={formData.rules}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Specify the rules for your tournament..."
                    ></textarea>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 border-b border-slate-700 pb-2">Tournament Structure</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="prizePool">
                        Prize Pool*
                      </label>
                      <input
                        type="text"
                        id="prizePool"
                        name="prizePool"
                        value={formData.prizePool}
                        onChange={handleChange}
                        className={`w-full bg-slate-700 border ${errors.prizePool ? 'border-red-500' : 'border-slate-600'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        placeholder="e.g., ₹50,000"
                      />
                      {errors.prizePool && <p className="text-red-500 mt-1 text-sm error-message">{errors.prizePool}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="location">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., Online or Delhi, India"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="teamSize">
                        Team Size
                      </label>
                      <select
                        id="teamSize"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="1">Solo (1 player)</option>
                        <option value="2">Duo (2 players)</option>
                        <option value="3">Trio (3 players)</option>
                        <option value="4">Squad (4 players)</option>
                        <option value="5">5v5 (5 players)</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="maxTeams">
                        Maximum Teams*
                      </label>
                      <input
                        type="number"
                        id="maxTeams"
                        name="maxTeams"
                        value={formData.maxTeams}
                        onChange={handleChange}
                        min="2"
                        className={`w-full bg-slate-700 border ${errors.maxTeams ? 'border-red-500' : 'border-slate-600'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                      {errors.maxTeams && <p className="text-red-500 mt-1 text-sm error-message">{errors.maxTeams}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="format">
                        Tournament Format
                      </label>
                      <select
                        id="format"
                        name="format"
                        value={formData.format}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {formatOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 border-b border-slate-700 pb-2">Tournament Banner</h2>
                  
                  <div className="mb-6">
                    <label className="block text-gray-300 mb-2" htmlFor="bannerImage">
                      Banner Image
                    </label>
                    <input
                      type="file"
                      id="bannerImage"
                      name="bannerImage"
                      accept="image/*"
                      onChange={handleChange}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-gray-400 text-sm mt-1">Recommended size: 1200 x 400 pixels. Max size: 2MB</p>
                  </div>

                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      id="isPublic"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleChange}
                      className="w-4 h-4 text-orange-500 border-gray-600 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="isPublic" className="ml-2 text-gray-300">
                      Make this tournament public (visible to all users)
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Link 
                    href="/tournaments" 
                    className="px-6 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </Link>
                  <motion.button
                    type="submit"
                    className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Tournament...
                      </>
                    ) : 'Create Tournament'}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
} 