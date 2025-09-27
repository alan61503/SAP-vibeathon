"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/registration?error=auth_failed');
          return;
        }

        if (data.session) {
          // User successfully authenticated
          router.push('/dashboard');
        } else {
          // No session found
          router.push('/registration?error=no_session');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        router.push('/registration?error=unexpected');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Completing Authentication...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we complete your login.
        </p>
      </div>
    </div>
  );
}
