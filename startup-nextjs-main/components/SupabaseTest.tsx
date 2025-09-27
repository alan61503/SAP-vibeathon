"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test the connection by making a simple query to check if we can connect
        const { data, error } = await supabase
          .from('attendees')
          .select('count')
          .limit(1);

        if (error) {
          // If attendees table doesn't exist, try a simpler connection test
          if (error.message.includes('relation "attendees" does not exist')) {
            // Test basic connection without specific table
            const { data: testData, error: testError } = await supabase
              .rpc('version');
            
            if (testError) {
              setError('Database connection failed: ' + testError.message);
              setConnectionStatus('Connection failed');
            } else {
              setConnectionStatus('Connected successfully! (Database ready for setup)');
            }
          } else {
            setError(error.message);
            setConnectionStatus('Connection failed');
          }
        } else {
          setConnectionStatus('Connected successfully!');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setConnectionStatus('Connection failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-dark rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-2">VIBE - Supabase Connection Test</h3>
      <div className="space-y-2">
        <p className="text-sm">
          <span className="font-medium">Status:</span> 
          <span className={`ml-2 ${connectionStatus.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {connectionStatus}
          </span>
        </p>
        {error && (
          <p className="text-sm text-red-600">
            <span className="font-medium">Error:</span> {error}
          </p>
        )}
        <p className="text-xs text-gray-500">
          URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}
        </p>
      </div>
    </div>
  );
}
