"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';

type TeamMember = {
  name: string;
  email: string;
  gameId: string;
};

type Tournament = {
  _id?: string;
  id?: string;
  name: string;
  game: string;
  teamSize: number;
  registrationFee: number;
  status?: string;
};

type RegistrationFormProps = {
  tournament: Tournament;
  onClose: () => void;
  onSuccess: () => void;
};

export default function TournamentRegistrationForm({ tournament, onClose, onSuccess }: RegistrationFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  
  // Form data
  const [teamName, setTeamName] = useState('');
  const [teamLeader, setTeamLeader] = useState({
    name: '',
    email: '',
    phone: '',
    gameId: '',
  });
  const [members, setMembers] = useState<TeamMember[]>(
    Array(tournament.teamSize - 1).fill(0).map(() => ({ 
      name: '', 
      email: '', 
      gameId: '' 
    }))
  );
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [transactionId, setTransactionId] = useState('');
  
  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setMembers(updatedMembers);
  };
  
  const validateStep1 = () => {
    if (!teamName.trim()) {
      setError('Team name is required');
      return false;
    }
    
    if (!teamLeader.name.trim() || !teamLeader.email.trim() || !teamLeader.phone.trim() || !teamLeader.gameId.trim()) {
      setError('All team leader fields are required');
      return false;
    }
    
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(teamLeader.email)) {
      setError('Please enter a valid email for team leader');
      return false;
    }
    
    setError(null);
    return true;
  };
  
  const validateStep2 = () => {
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      if (!member.name.trim() || !member.email.trim() || !member.gameId.trim()) {
        setError(`All fields are required for Team Member ${i + 1}`);
        return false;
      }
      
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(member.email)) {
        setError(`Please enter a valid email for Team Member ${i + 1}`);
        return false;
      }
    }
    
    setError(null);
    return true;
  };
  
  const validateStep3 = () => {
    if (tournament.registrationFee > 0 && !transactionId.trim()) {
      setError('Transaction ID is required');
      return false;
    }
    
    if (!agreedToTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }
    
    setError(null);
    return true;
  };
  
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (step === 3) {
      if (!validateStep1() || !validateStep2() || !validateStep3()) {
        // If any validation fails, don't proceed
        return;
      }
    }
    
    // Filter out empty team members (in case any weren't properly filled out)
    const filteredMembers = members.filter(member => 
      member.name.trim() !== '' && 
      member.email.trim() !== '' && 
      member.gameId.trim() !== ''
    );
    
    // Check if we have the right number of team members
    if (filteredMembers.length < tournament.teamSize - 1) {
      setError(`You need to add ${tournament.teamSize - 1} team members (excluding team leader)`);
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    // Check if user is authenticated with NextAuth
    if (!session || !session.user) {
      setError('You must be logged in to register for tournaments');
      setIsSubmitting(false);
      return;
    }

    try {
      const tournamentId = tournament._id || tournament.id;
      
      if (!tournamentId) {
        throw new Error('Tournament ID is missing or invalid');
      }

      console.log('Tournament ID used for registration:', tournamentId);
      
      // Structure the registration data for Supabase
      const registrationData = {
        tournamentId,
        userId: session.user.id || session.user.email,
        teamName,
        teamMembers: filteredMembers,
        captain: {
          name: teamLeader.name,
          email: teamLeader.email,
          phone: teamLeader.phone,
          gameId: teamLeader.gameId
        },
        contactInfo: {
          email: teamLeader.email,
          phone: teamLeader.phone
        },
        // Include payment info
        paymentStatus: tournament.registrationFee > 0 ? 'pending' : 'free',
        paymentMethod: tournament.registrationFee > 0 ? paymentMethod : 'none',
        transactionId: tournament.registrationFee > 0 ? transactionId : '',
        // Terms agreement
        agreedToTerms
      };
      
      console.log('Registration data being submitted:', registrationData);
      console.log('Team members count:', filteredMembers.length);

      const response = await axios.post(
        `/api/tournaments/${tournamentId}/register`,
        registrationData,
        { timeout: 15000 } // 15 second timeout
      );

      setIsSubmitting(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      // Detailed error handling
      let errorMessage = 'Failed to register for the tournament. Please try again.';
      
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response data:', err.response.data);
          console.error('Error response status:', err.response.status);
          
          errorMessage = err.response.data?.error || 
                         `Server error (${err.response.status}): ${err.response.statusText}`;
        } else if (err.request) {
          // The request was made but no response was received
          console.error('No response received:', err.request);
          errorMessage = 'No response from server. Please check your connection and try again.';
        } else {
          // Something happened in setting up the request
          console.error('Error setting up request:', err.message);
          errorMessage = `Request error: ${err.message}`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Register for {tournament.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Progress indicator */}
        <div className="flex mb-8">
          <div className={`flex-1 h-2 ${step >= 1 ? 'bg-orange-500' : 'bg-gray-600'} rounded-l`}></div>
          <div className={`flex-1 h-2 ${step >= 2 ? 'bg-orange-500' : 'bg-gray-600'}`}></div>
          <div className={`flex-1 h-2 ${step >= 3 ? 'bg-orange-500' : 'bg-gray-600'} rounded-r`}></div>
        </div>
        
        {/* Error alert */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Step 1: Team Information */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Team Information</h3>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Team Name*</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  placeholder="Enter your team name"
                  required
                />
              </div>
              
              <div className="border-t border-gray-700 my-6 pt-6">
                <h4 className="text-lg font-semibold mb-4">Team Leader Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Full Name*</label>
                    <input
                      type="text"
                      value={teamLeader.name}
                      onChange={(e) => setTeamLeader({...teamLeader, name: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Email*</label>
                    <input
                      type="email"
                      value={teamLeader.email}
                      onChange={(e) => setTeamLeader({...teamLeader, email: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      placeholder="johndoe@example.com"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Phone Number*</label>
                    <input
                      type="tel"
                      value={teamLeader.phone}
                      onChange={(e) => setTeamLeader({...teamLeader, phone: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">
                      {tournament.game} Game ID/Username*
                    </label>
                    <input
                      type="text"
                      value={teamLeader.gameId}
                      onChange={(e) => setTeamLeader({...teamLeader, gameId: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      placeholder="Your in-game ID"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Team Members */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Team Members</h3>
              <p className="text-gray-400 mb-6">
                Please provide details for {tournament.teamSize - 1} team members (excluding team leader)
              </p>
              
              {members.map((member, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold mb-4">Team Member {index + 1}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2">Full Name*</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateMember(index, 'name', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2">Email*</label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => updateMember(index, 'email', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                        placeholder="johndoe@example.com"
                        required
                      />
                    </div>
                    
                    <div className="mb-4 md:col-span-2">
                      <label className="block text-gray-300 mb-2">
                        {tournament.game} Game ID/Username*
                      </label>
                      <input
                        type="text"
                        value={member.gameId}
                        onChange={(e) => updateMember(index, 'gameId', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                        placeholder="In-game ID"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Step 3: Payment and Confirmation */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Payment & Confirmation</h3>
              
              {tournament.registrationFee > 0 ? (
                <div className="mb-6">
                  <div className="bg-gray-700 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold mb-2">Registration Fee</h4>
                    <p className="text-2xl font-bold text-orange-400">₹{tournament.registrationFee}</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Payment Method*</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      required
                    >
                      <option value="upi">UPI</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Transaction ID*</label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      placeholder="Enter your transaction ID"
                      required
                    />
                  </div>
                  
                  <div className="bg-orange-500/20 border border-orange-500 p-4 rounded-lg mb-6">
                    <p className="font-semibold text-orange-400 mb-2">Payment Instructions:</p>
                    <ol className="list-decimal list-inside text-gray-300 space-y-1">
                      <li>Make a payment of ₹{tournament.registrationFee} to UPI ID: organizer@upi</li>
                      <li>Enter the transaction ID/reference number above</li>
                      <li>Your registration will be confirmed after payment verification</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="bg-green-500/20 border border-green-500 p-4 rounded-lg mb-6">
                  <p className="text-green-400 font-semibold">This tournament has no registration fee. You can register for free!</p>
                </div>
              )}
              
              <div className="mb-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 mr-2"
                    required
                  />
                  <span className="text-gray-300">
                    I agree to the tournament rules and terms & conditions. I confirm that all the information provided is accurate.
                  </span>
                </label>
              </div>
            </div>
          )}
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 ${isSubmitting ? 'bg-gray-500' : 'bg-orange-500 hover:bg-orange-600'} text-white font-bold rounded-lg transition-colors flex items-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Submit Registration'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}