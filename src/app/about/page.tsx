"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPage() {
  // Sample team data
  const teamMembers = [
    {
      id: 1,
      name: 'Shubham Kushwaha',
      role: 'Founder & CEO',
      image: '/images/team/shubham.jpg',
      bio: 'Passionate gamer and entrepreneur with a vision to elevate the Indian esports scene to global standards.',
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/',
      }
    },
    {
      id: 2,
      name: 'Rajat Verma',
      role: 'Tournament Director',
      image: '/images/team/team-member-2.jpg',
      bio: 'Experienced tournament organizer with over 5 years of experience managing competitive gaming events.',
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/',
      }
    },
    {
      id: 3,
      name: 'Priya Singh',
      role: 'Community Manager',
      image: '/images/team/team-member-3.jpg',
      bio: 'Dedicated to building and nurturing gaming communities across India with a focus on inclusivity.',
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/',
      }
    },
    {
      id: 4,
      name: 'Aditya Kumar',
      role: 'Technical Lead',
      image: '/images/team/team-member-4.jpg',
      bio: 'Full-stack developer with expertise in creating seamless gaming platforms and tournament systems.',
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/',
      }
    }
  ];

  return (
    <div className="bg-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About EpicEsports India</h1>
            <p className="text-xl text-gray-300">
              Building the future of competitive gaming in India, one tournament at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Facts</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-slate-800 p-8 rounded-lg text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-4xl font-bold text-orange-500 mb-2">50+</h3>
              <p className="text-xl text-gray-300">Esports Events Hosted</p>
            </motion.div>
            
            <motion.div 
              className="bg-slate-800 p-8 rounded-lg text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-4xl font-bold text-orange-500 mb-2">15+</h3>
              <p className="text-xl text-gray-300">Colleges Partnered With</p>
            </motion.div>
            
            <motion.div 
              className="bg-slate-800 p-8 rounded-lg text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-4xl font-bold text-orange-500 mb-2">1000+</h3>
              <p className="text-xl text-gray-300">Players Engaged</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Meet the passionate individuals behind EpicEsports India who are dedicated to shaping the future of competitive gaming in India.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <motion.div 
                key={member.id} 
                className="bg-slate-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: member.id * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="h-64 relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-orange-400 text-sm mb-4">{member.role}</p>
                  <p className="text-gray-300 text-sm mb-4">{member.bio}</p>
                  
                  <div className="flex space-x-3">
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
              <p className="text-xl mb-6">
                Whether you're a player, tournament organizer, content creator, or just passionate about gaming, there's a place for you in the EpicEsports community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/register"
                  className="bg-white text-orange-600 px-6 py-3 rounded-md font-semibold hover:bg-slate-100 transition-colors"
                >
                  Create Account
                </Link>
                <Link 
                  href="/careers"
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-orange-600 transition-colors"
                >
                  Join Our Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}