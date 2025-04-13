"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [tournamentHistory, setTournamentHistory] = useState([]);

  // Fetch user profile data
  useEffect(() => {
    const fetchData = async () => {
      if (status === "unauthenticated") {
        router.push("/login?redirect=/account");
        return;
      }

      if (status !== "authenticated") return;

      setLoading(true);
      try {
        // Fetch profile data
        const profileResponse = await axios.get("/api/profile");
        setUserData(profileResponse.data.profile);

        // Fetch tournament history
        const historyResponse = await axios.get("/api/profile/history");
        setTournamentHistory(historyResponse.data.history);

        setError("");
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load your account data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, router]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-slate-900 min-h-screen text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-slate-900 min-h-screen text-white flex flex-col items-center justify-center p-4">
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

  // If no user data
  if (!userData) {
    return (
      <div className="bg-slate-900 min-h-screen text-white flex flex-col items-center justify-center p-4">
        <div className="text-xl mb-4">No profile data found</div>
        <Link
          href="/profile/setup"
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
        >
          Create Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-white pb-20">
      {/* Account Header */}
      <section className="bg-slate-800 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-col md:flex-row items-center md:items-start gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={userData.avatarUrl || "/images/avatar-placeholder.png"}
                alt={userData.displayName || userData.username}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </motion.div>
            <div className="text-center md:text-left">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {userData.displayName || userData.username}
              </motion.h1>
              <motion.p 
                className="text-gray-300 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                @{userData.username} • Member since {new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <span className="bg-orange-600 px-3 py-1 rounded-md text-sm font-medium">
                  {userData.experienceLevel ? 
                    `${userData.experienceLevel.charAt(0).toUpperCase()}${userData.experienceLevel.slice(1)}` : 
                    'Beginner'}
                </span>
                <span className="bg-green-600 px-3 py-1 rounded-md text-sm font-medium">
                  Wins: {userData.matchesWon || 0}
                </span>
                <span className="bg-blue-600 px-3 py-1 rounded-md text-sm font-medium">
                  Tournaments: {userData.totalTournaments || 0}
                </span>
              </motion.div>
            </div>
            <motion.div 
              className="md:ml-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="/profile/edit" className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                Edit Profile
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="border-b border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar">
            <motion.button 
              className={`px-6 py-4 font-medium ${activeTab === "profile" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-400 hover:text-white"}`}
              onClick={() => setActiveTab("profile")}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              Profile
            </motion.button>
            <motion.button 
              className={`px-6 py-4 font-medium ${activeTab === "tournaments" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-400 hover:text-white"}`}
              onClick={() => setActiveTab("tournaments")}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              Tournaments
            </motion.button>
            <motion.button 
              className={`px-6 py-4 font-medium ${activeTab === "teams" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-400 hover:text-white"}`}
              onClick={() => setActiveTab("teams")}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              Teams
            </motion.button>
            <motion.button 
              className={`px-6 py-4 font-medium ${activeTab === "settings" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-400 hover:text-white"}`}
              onClick={() => setActiveTab("settings")}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              Settings
            </motion.button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="bg-slate-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 border-b border-slate-700 pb-2">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Full Name</h3>
                    <p className="text-lg">{userData.displayName || userData.username}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Username</h3>
                    <p className="text-lg">@{userData.username}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Email</h3>
                    <p className="text-lg">{userData.email}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Member Since</h3>
                    <p className="text-lg">{new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 border-b border-slate-700 pb-2">Gaming Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-700 p-6 rounded-lg text-center">
                    <h3 className="text-orange-400 text-xl mb-2">Current Rank</h3>
                    <p className="text-3xl font-bold">{userData.experienceLevel ? 
                      `${userData.experienceLevel.charAt(0).toUpperCase()}${userData.experienceLevel.slice(1)}` : 
                      'Beginner'}
                    </p>
                  </div>
                  <div className="bg-slate-700 p-6 rounded-lg text-center">
                    <h3 className="text-green-400 text-xl mb-2">Total Wins</h3>
                    <p className="text-3xl font-bold">{userData.matchesWon || 0}</p>
                  </div>
                  <div className="bg-slate-700 p-6 rounded-lg text-center">
                    <h3 className="text-blue-400 text-xl mb-2">Total Tournaments</h3>
                    <p className="text-3xl font-bold">{userData.totalTournaments || 0}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-3">Win Rate</h3>
                  <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-yellow-400"
                      style={{ width: `${(userData.matchesWon / (userData.matchesWon + userData.matchesLost) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-right font-medium">{Math.round(userData.matchesWon / (userData.matchesWon + userData.matchesLost) * 100)}%</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tournaments Tab */}
          {activeTab === "tournaments" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-slate-800 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-2">Tournament History</h2>
                
                {tournamentHistory.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tournamentHistory.map((tournament, index) => (
                      <motion.div
                        key={tournament.registrationId || index}
                        className="bg-slate-700 rounded-lg overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="p-4">
                          <h3 className="font-bold text-xl mb-2">{tournament.tournamentName}</h3>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300">{tournament.game}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium 
                              ${tournament.registrationStatus === 'approved' ? 'bg-green-600' : 
                                tournament.registrationStatus === 'pending' ? 'bg-yellow-600' : 
                                tournament.registrationStatus === 'completed' ? 'bg-blue-600' : 'bg-red-600'}`}>
                              {tournament.registrationStatus}
                            </span>
                          </div>
                          <div className="text-gray-400 text-sm flex justify-between">
                            <span>Start Date: {tournament.startDate || 'N/A'}</span>
                            <span>Team: {tournament.teamName || 'Individual'}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-slate-700 rounded-lg">
                    <p className="text-xl text-gray-300 mb-4">You haven't participated in any tournaments yet.</p>
                    <Link href="/tournaments" className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors inline-block">
                      Browse Tournaments
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Teams Tab */}
          {activeTab === "teams" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-slate-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-2">My Teams</h2>
                
                {/* Placeholder for teams - will be implemented in a future update */}
                <div className="text-center p-8 bg-slate-700 rounded-lg">
                  <p className="text-xl text-gray-300 mb-4">Team management is coming soon!</p>
                  <p className="text-gray-400 mb-4">You'll be able to create and join teams, manage team members, and view team statistics.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-slate-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-2">Account Settings</h2>
                
                <div className="space-y-6">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-4">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Tournament updates</span>
                        <label className="relative inline-block w-12 h-6">
                          <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                          <span className="absolute cursor-pointer inset-0 bg-gray-400 rounded-full transition before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:left-1 before:bottom-1 before:transition before:checked:translate-x-6 before:peer-checked:bg-white peer-checked:bg-orange-500"></span>
                        </label>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Team invitations</span>
                        <label className="relative inline-block w-12 h-6">
                          <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                          <span className="absolute cursor-pointer inset-0 bg-gray-400 rounded-full transition before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:left-1 before:bottom-1 before:transition before:checked:translate-x-6 before:peer-checked:bg-white peer-checked:bg-orange-500"></span>
                        </label>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Website updates & news</span>
                        <label className="relative inline-block w-12 h-6">
                          <input type="checkbox" className="opacity-0 w-0 h-0" />
                          <span className="absolute cursor-pointer inset-0 bg-gray-400 rounded-full transition before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:left-1 before:bottom-1 before:transition before:checked:translate-x-6 before:peer-checked:bg-white peer-checked:bg-orange-500"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-4">Privacy Settings</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Show profile to public</span>
                        <label className="relative inline-block w-12 h-6">
                          <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                          <span className="absolute cursor-pointer inset-0 bg-gray-400 rounded-full transition before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:left-1 before:bottom-1 before:transition before:checked:translate-x-6 before:peer-checked:bg-white peer-checked:bg-orange-500"></span>
                        </label>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Show stats to public</span>
                        <label className="relative inline-block w-12 h-6">
                          <input type="checkbox" className="opacity-0 w-0 h-0" defaultChecked />
                          <span className="absolute cursor-pointer inset-0 bg-gray-400 rounded-full transition before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:left-1 before:bottom-1 before:transition before:checked:translate-x-6 before:peer-checked:bg-white peer-checked:bg-orange-500"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-4">Password & Security</h3>
                    <div className="space-y-4">
                      <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                        Change Password
                      </button>
                      <button className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-500 transition-colors">
                        Enable Two-Factor Authentication
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
} 