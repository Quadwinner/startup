"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('forums');
  
  // Sample forum categories
  const forumCategories = [
    {
      id: 1,
      name: 'General Discussion',
      description: 'Talk about anything related to esports and gaming in India',
      topics: 156,
      posts: 2340,
      icon: '🎮'
    },
    {
      id: 2,
      name: 'Tournament Discussions',
      description: 'Discuss ongoing and upcoming tournaments',
      topics: 89,
      posts: 1245,
      icon: '🏆'
    },
    {
      id: 3,
      name: 'Team Recruitment',
      description: 'Find teammates or join a team',
      topics: 210,
      posts: 1892,
      icon: '👥'
    },
    {
      id: 4,
      name: 'Game Strategies',
      description: 'Share tips, tricks, and strategies for different games',
      topics: 134,
      posts: 2567,
      icon: '🧠'
    },
    {
      id: 5,
      name: 'Technical Support',
      description: 'Get help with technical issues',
      topics: 78,
      posts: 980,
      icon: '🔧'
    },
    {
      id: 6,
      name: 'Content Creation',
      description: 'Discuss streaming, YouTube, and content creation',
      topics: 95,
      posts: 1430,
      icon: '📹'
    }
  ];

  // Sample Discord communities
  const discordCommunities = [
    {
      id: 1,
      name: 'EpicEsports India Official',
      members: '5,230',
      description: 'The official Discord server for EpicEsports India. Join for tournament announcements, community events, and more.',
      image: '/images/community/discord-1.jpg',
      link: 'https://discord.gg/'
    },
    {
      id: 2,
      name: 'Indian Valorant Hub',
      members: '12,456',
      description: 'A community for Indian Valorant players to find teams, discuss strategies, and participate in community tournaments.',
      image: '/images/community/discord-2.jpg',
      link: 'https://discord.gg/'
    },
    {
      id: 3,
      name: 'BGMI Competitive',
      members: '8,932',
      description: 'Connect with BGMI players and teams. Regular scrims and custom room matches.',
      image: '/images/community/discord-3.jpg',
      link: 'https://discord.gg/'
    },
    {
      id: 4,
      name: 'Esports College Network',
      members: '3,657',
      description: 'Connecting college students interested in esports across India. Inter-college tournaments and networking.',
      image: '/images/community/discord-4.jpg',
      link: 'https://discord.gg/'
    }
  ];

  // Sample events
  const communityEvents = [
    {
      id: 1,
      title: 'Community Game Night',
      date: 'June 10, 2023',
      time: '8:00 PM IST',
      platform: 'Discord',
      description: 'Join us for a fun night of casual gaming. Games include Among Us, Fall Guys, and more!',
      image: '/images/events/community-meetup.jpg'
    },
    {
      id: 2,
      title: 'Q&A with Pro Players',
      date: 'June 15, 2023',
      time: '7:30 PM IST',
      platform: 'Discord & YouTube',
      description: 'Ask questions and get advice from professional esports players from top Indian teams.',
      image: '/images/events/qa-session.jpg'
    },
    {
      id: 3,
      title: "Beginner's Workshop: Valorant",
      date: 'June 20, 2023',
      time: '6:00 PM IST',
      platform: 'Discord & Valorant',
      description: 'Learn the basics of Valorant from experienced players. Perfect for newcomers to the game!',
      image: '/images/events/workshop.jpg'
    }
  ];

  return (
    <div className="bg-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-800">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/esports-team.jpg"
            alt="Community background"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Community</h1>
            <p className="text-xl text-gray-300">
              Connect with fellow gamers, find teams, share strategies, and be part of India's growing esports ecosystem
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Tabs */}
      <section className="py-8 bg-slate-800 border-t border-b border-slate-700 sticky top-16 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide space-x-4">
            <button 
              onClick={() => setActiveTab('forums')}
              className={`px-6 py-2 rounded-full transition-colors whitespace-nowrap ${activeTab === 'forums' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
            >
              Forums
            </button>
            <button 
              onClick={() => setActiveTab('discord')}
              className={`px-6 py-2 rounded-full transition-colors whitespace-nowrap ${activeTab === 'discord' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
            >
              Discord Communities
            </button>
            <button 
              onClick={() => setActiveTab('events')}
              className={`px-6 py-2 rounded-full transition-colors whitespace-nowrap ${activeTab === 'events' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
            >
              Community Events
            </button>
            <button 
              onClick={() => setActiveTab('teams')}
              className={`px-6 py-2 rounded-full transition-colors whitespace-nowrap ${activeTab === 'teams' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
            >
              Find Teams
            </button>
          </div>
        </div>
      </section>
      
      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Forums */}
          {activeTab === 'forums' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Community Forums</h2>
                <Link 
                  href="/community/forums"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Create New Topic
                </Link>
              </div>
              
              <div className="grid gap-6">
                {forumCategories.map(category => (
                  <motion.div 
                    key={category.id}
                    className="bg-slate-800 rounded-lg p-6 hover:shadow-lg transition-all"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-start">
                      <div className="bg-slate-700 rounded-full w-12 h-12 flex items-center justify-center text-2xl mr-4">
                        {category.icon}
                      </div>
                      <div className="flex-grow">
                        <Link 
                          href={`/community/forums/${category.id}`}
                          className="text-xl font-bold hover:text-orange-400 transition-colors"
                        >
                          {category.name}
                        </Link>
                        <p className="text-gray-400 mt-1">{category.description}</p>
                      </div>
                      <div className="text-right text-sm text-gray-400">
                        <div>{category.topics} topics</div>
                        <div>{category.posts} posts</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Discord Communities */}
          {activeTab === 'discord' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-8">Discord Communities</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {discordCommunities.map(community => (
                  <motion.div 
                    key={community.id}
                    className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                    whileHover={{ y: -5 }}
                  >
                    <div className="h-48 relative">
                      <Image
                        src={community.image}
                        alt={community.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4">
                        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm mb-2">
                          {community.members} members
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{community.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{community.description}</p>
                      <a 
                        href={community.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded inline-flex items-center transition-colors"
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="currentColor"/>
                        </svg>
                        Join Discord
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Community Events */}
          {activeTab === 'events' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-8">Upcoming Community Events</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {communityEvents.map(event => (
                  <motion.div 
                    key={event.id}
                    className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                    whileHover={{ y: -5 }}
                  >
                    <div className="h-48 relative">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <div className="flex items-center text-gray-400 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-400 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-400 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">{event.platform}</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">{event.description}</p>
                      <Link 
                        href={`/events/${event.id}`}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors inline-block"
                      >
                        Register
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link 
                  href="/events"
                  className="text-orange-400 hover:text-orange-500 transition-colors inline-flex items-center"
                >
                  View all community events
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Find Teams */}
          {activeTab === 'teams' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-bold mb-4">Find Your Team</h2>
                <p className="text-gray-300">
                  Looking for teammates or want to join an existing team? This is the place to start. Browse team listings or create your own to find the perfect match for your competitive journey.
                </p>
              </div>
              
              <div className="bg-slate-800 p-8 rounded-lg text-center mb-12">
                <h3 className="text-xl font-bold mb-4">Team Finder Coming Soon!</h3>
                <p className="text-gray-300 mb-6">
                  We're currently developing our team matchmaking feature. In the meantime, you can use our Discord community to connect with other players.
                </p>
                <button
                  onClick={() => setActiveTab('discord')}
                  className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-3 rounded inline-flex items-center transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="currentColor"/>
                  </svg>
                  Join Our Discord
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg p-8">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-2/3 mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold mb-2">Want to be notified when Team Finder launches?</h3>
                    <p className="mb-4">
                      Sign up for our newsletter to get updates on all our new features and community tools.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="email" 
                        placeholder="Your email address" 
                        className="bg-white text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
                      />
                      <button className="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors">
                        Subscribe
                      </button>
                    </div>
                  </div>
                  <div className="md:w-1/3 md:flex md:justify-end">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
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