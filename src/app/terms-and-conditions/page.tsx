"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms & Conditions</h1>
            <p className="text-xl text-gray-300">
              Last updated: April 13, 2025
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-slate-800 rounded-lg p-8 shadow-lg">
            <div className="prose prose-lg prose-invert max-w-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p className="mb-6">
                  Welcome to EpicEsports India. These terms and conditions outline the rules and regulations for the use of our website and services.
                  By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use EpicEsports India's website
                  if you do not accept all of the terms and conditions stated on this page.
                </p>
                
                <h2 className="text-2xl font-bold mb-4">2. License to Use Website</h2>
                <p className="mb-6">
                  Unless otherwise stated, EpicEsports India and/or its licensors own the intellectual property rights for all material on this website.
                  All intellectual property rights are reserved. You may view and/or print pages from the website for your own personal use subject to
                  restrictions set in these terms and conditions.
                </p>
                <p className="mb-6">
                  You must not:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li className="mb-2">Republish material from this website</li>
                  <li className="mb-2">Sell, rent or sub-license material from this website</li>
                  <li className="mb-2">Reproduce, duplicate or copy material from this website</li>
                  <li className="mb-2">Redistribute content from EpicEsports India (unless content is specifically made for redistribution)</li>
                </ul>
                
                <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                <p className="mb-6">
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so
                  constitutes a breach of the Terms, which may result in immediate termination of your account on our website.
                </p>
                <p className="mb-6">
                  You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
                  You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or
                  unauthorized use of your account.
                </p>
                
                <h2 className="text-2xl font-bold mb-4">4. Tournament Registration and Participation</h2>
                <p className="mb-6">
                  By registering for tournaments on our platform, you agree to:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li className="mb-2">Provide accurate and complete registration information</li>
                  <li className="mb-2">Adhere to all tournament rules and guidelines</li>
                  <li className="mb-2">Accept the final decisions of tournament administrators</li>
                  <li className="mb-2">Maintain respectful and sportsmanlike conduct at all times</li>
                  <li className="mb-2">Grant us permission to use your gameplay footage, name, and likeness for promotional purposes</li>
                </ul>
                <p className="mb-6">
                  We reserve the right to disqualify participants who violate these terms or engage in unsportsmanlike conduct.
                </p>
                
                <h2 className="text-2xl font-bold mb-4">5. User-Generated Content</h2>
                <p className="mb-6">
                  Our service may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material.
                  You are responsible for the content that you post to the service, including its legality, reliability, and appropriateness.
                </p>
                <p className="mb-6">
                  By posting content to the service, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such
                  content on and through the service. You retain any and all of your rights to any content you submit, post or display on or through the service
                  and you are responsible for protecting those rights.
                </p>
                
                <h2 className="text-2xl font-bold mb-4">6. Prohibited Activities</h2>
                <p className="mb-6">
                  The following behaviors are prohibited on our platform:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li className="mb-2">Cheating or using unauthorized software during tournaments</li>
                  <li className="mb-2">Harassment, hate speech, or discrimination of any kind</li>
                  <li className="mb-2">Impersonation of other users or EpicEsports staff</li>
                  <li className="mb-2">Attempting to gain unauthorized access to other accounts or our systems</li>
                  <li className="mb-2">Distribution of malware or engaging in any activity that disrupts our services</li>
                  <li className="mb-2">Any activity that violates applicable laws or regulations</li>
                </ul>
                
                <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
                <p className="mb-6">
                  In no event shall EpicEsports India, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect,
                  incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
                  losses, resulting from your access to or use of or inability to access or use the service.
                </p>
                
                <h2 className="text-2xl font-bold mb-4">8. Governing Law</h2>
                <p className="mb-6">
                  These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
                
                <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
                <p className="mb-6">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least
                  30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
                
                <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
                <p className="mb-6">
                  If you have any questions about these Terms, please contact us at:
                  <br /><br />
                  Email: <a href="mailto:shubhamkush012@gmail.com" className="text-orange-400 hover:text-orange-300">shubhamkush012@gmail.com</a>
                  <br />
                  Phone: +91 8824013820
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Links */}
      <section className="py-12 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Related Legal Information</h2>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <Link 
                href="/privacy-policy"
                className="bg-slate-700 hover:bg-slate-600 transition-colors rounded-lg p-6 text-center"
              >
                <h3 className="text-xl font-semibold mb-2">Privacy Policy</h3>
                <p className="text-gray-300">
                  Learn how we collect and use your data.
                </p>
              </Link>
              <Link 
                href="/contact"
                className="bg-slate-700 hover:bg-slate-600 transition-colors rounded-lg p-6 text-center"
              >
                <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
                <p className="text-gray-300">
                  Have questions about our terms? Get in touch.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
