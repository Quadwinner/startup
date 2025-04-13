'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [loading, setLoading] = useState(true);
  const [supabaseInfo, setSupabaseInfo] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkSupabase() {
      try {
        // Get Supabase info
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set';
        const keyExists = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        setSupabaseInfo({
          url,
          keyExists,
          hardcodedUrl: 'https://xbmfrgpaodddvavuclms.supabase.co',
          hardcodedKeyExists: true
        });

        // Test supabase connection
        try {
          const { error } = await supabase.from('_test').select('*').limit(1);
          if (error) {
            setError(error.message);
          }
        } catch (connErr) {
          console.error('Connection error:', connErr);
          setError(connErr instanceof Error ? connErr.message : String(connErr));
        }
      } catch (err) {
        console.error('Test error:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    checkSupabase();
  }, []);

  return (
    <div className="p-8 bg-slate-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Supabase Test Page</h1>
      
      <div className="bg-slate-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
        {loading ? (
          <p>Testing connection...</p>
        ) : (
          <div className="space-y-2">
            <p>
              Status: {' '}
              {error ? (
                <span className="text-red-500">Failed: {error}</span>
              ) : (
                <span className="text-green-500">Working</span>
              )}
            </p>
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Supabase Configuration</h3>
              <ul className="list-disc list-inside space-y-1 text-sm bg-slate-700 p-4 rounded">
                <li>URL from env: {supabaseInfo.url}</li>
                <li>Key from env: {supabaseInfo.keyExists ? 'Present' : 'Missing'}</li>
                <li>Hardcoded URL: {supabaseInfo.hardcodedUrl}</li>
                <li>Hardcoded Key: {supabaseInfo.hardcodedKeyExists ? 'Present' : 'Missing'}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-slate-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Database Connection</h2>
        <div className="flex flex-col gap-4">
          <button 
            onClick={async () => {
              try {
                const { data, error } = await supabase.from('tournaments').select('*').limit(5);
                if (error) {
                  alert(`Error: ${error.message}`);
                } else {
                  alert(`Success! Found ${data?.length || 0} tournaments.`);
                  console.log('Tournaments:', data);
                }
              } catch (err) {
                alert(`Error: ${err instanceof Error ? err.message : String(err)}`);
              }
            }}
            className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded"
          >
            Test Tournaments Table
          </button>
          
          <button 
            onClick={async () => {
              try {
                const { data, error } = await supabase.from('players').select('*').limit(5);
                if (error) {
                  alert(`Error: ${error.message}`);
                } else {
                  alert(`Success! Found ${data?.length || 0} players.`);
                  console.log('Players:', data);
                }
              } catch (err) {
                alert(`Error: ${err instanceof Error ? err.message : String(err)}`);
              }
            }}
            className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded"
          >
            Test Players Table
          </button>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>If connection is working, go to <a href="/test/login" className="text-orange-400 underline">Test Login Page</a></li>
          <li>If you see a "relation does not exist" error, run the SQL scripts to create the tables</li>
          <li>If you see a permission error, check RLS policies in Supabase</li>
        </ul>
      </div>
    </div>
  );
} 