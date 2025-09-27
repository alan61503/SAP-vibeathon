"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EnhancedEventAgenda from '@/components/Agenda/EnhancedEventAgenda';
import { oauth } from '@/lib/oauth';

export default function AgendaPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user, error } = await oauth.getCurrentUser();
        
        if (error || !user) {
          router.push('/registration');
          return;
        }

        setUser(user);
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/registration');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Loading Agenda...
          </h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <EnhancedEventAgenda attendeeId={user.id} />
      </div>
    </div>
  );
}
