"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthModal from '@/components/Registration/AuthModal';
import UserDashboard from '@/components/Registration/UserDashboard';
import OAuthLogin from '@/components/Registration/OAuthLogin';
import RegistrationForm from '@/components/Registration/RegistrationForm';
import QRCodeDisplay from '@/components/Registration/QRCodeDisplay';
import { oauth } from '@/lib/oauth';

function RegistrationContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'professional' | 'student' | null>(null);
  const [prefilledData, setPrefilledData] = useState<any>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredAttendee, setRegisteredAttendee] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for user type from URL parameter
        const typeParam = searchParams.get('type');
        if (typeParam && (typeParam === 'professional' || typeParam === 'student')) {
          setUserType(typeParam);
        }

        // Check for pre-filled data from localStorage (from signup flow)
        const storedUserType = localStorage.getItem('userType');
        const storedEmail = localStorage.getItem('userEmail');
        const storedName = localStorage.getItem('userName');
        
        if (storedUserType && storedEmail && storedName) {
          setUserType(storedUserType as 'professional' | 'student');
          setPrefilledData({
            name: storedName,
            email: storedEmail,
            userType: storedUserType
          });
          // Clear localStorage after using the data
          localStorage.removeItem('userType');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userName');
        }

        const { user } = await oauth.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = oauth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setCurrentUser(session.user);
        router.push('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLoginSuccess = (attendee: any) => {
    setCurrentUser(attendee);
    setIsAuthModalOpen(false);
  };

  const handleRegisterSuccess = () => {
    setIsAuthModalOpen(false);
    // Optionally show a success message or redirect
  };

  const handleLogout = async () => {
    await oauth.signOut();
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Loading...
          </h2>
        </div>
      </div>
    );
  }

  if (currentUser) {
    return <UserDashboard attendee={currentUser} onLogout={handleLogout} />;
  }

  // If user type is selected, show the registration form
  if (userType) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {registrationSuccess ? (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Registration Complete! 🎉
              </h1>
              <QRCodeDisplay attendeeData={registeredAttendee} />
              <div className="mt-8">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Complete Your Registration
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Registering as: <span className="text-primary font-semibold capitalize">{userType}</span>
                </p>
              </div>
              <RegistrationForm 
                userType={userType} 
                prefilledData={prefilledData}
                onSuccess={(attendeeData) => {
                  setRegistrationSuccess(true);
                  setRegisteredAttendee(attendeeData);
                }}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            VIBE - SAP Vibeathon Registration
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join us for an exciting event! Register as a professional or student.
          </p>
          
          {/* OAuth Login Section */}
          <div className="max-w-md mx-auto mb-8">
            <OAuthLogin 
              onSuccess={(user) => {
                setCurrentUser(user);
                router.push('/dashboard');
              }}
              onError={(error) => {
                console.error('OAuth error:', error);
              }}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Or use email registration
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="mt-4 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors"
          >
            Register with Email
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Professional Registration
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Register as a professional with your company details, designation, and experience.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.083 12.083 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Student Registration
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Register as a student with your college details, education level, and year of study.
              </p>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Event Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Date & Time</h4>
              <p className="text-gray-600 dark:text-gray-400">TBD</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Location</h4>
              <p className="text-gray-600 dark:text-gray-400">TBD</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Duration</h4>
              <p className="text-gray-600 dark:text-gray-400">Full Day Event</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
      />
    </div>
  );
}

export default function RegistrationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Loading...
          </h2>
        </div>
      </div>
    }>
      <RegistrationContent />
    </Suspense>
  );
}
