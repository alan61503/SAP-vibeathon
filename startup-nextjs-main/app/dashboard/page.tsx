"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { oauth } from '@/lib/oauth';
import { attendees } from '@/lib/attendees';
import ProfessionalRegistrationForm from '@/components/Registration/ProfessionalRegistrationForm';
import StudentRegistrationForm from '@/components/Registration/StudentRegistrationForm';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [attendee, setAttendee] = useState<any>(null);
  const [userType, setUserType] = useState<'professional' | 'student' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

        // Get user type from localStorage
        const storedUserType = localStorage.getItem('userType') as 'professional' | 'student' | null;
        setUserType(storedUserType);

        // Check if user is already registered as an attendee
        const { data: attendeeData, error: attendeeError } = await attendees.getAttendeeByEmail(user.email);
        
        if (attendeeData) {
          setAttendee(attendeeData);
        }
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await oauth.signOut();
    localStorage.removeItem('userType');
    router.push('/registration');
  };

  const handleRegistrationSuccess = (newAttendee: any) => {
    setAttendee(newAttendee);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Loading Dashboard...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/registration')}
            className="bg-primary text-white px-6 py-2 rounded-lg"
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  // If user hasn't selected a type yet, redirect to user type selection
  if (!userType) {
    router.push('/user-type-selection');
    return null;
  }

  // If user is not registered, show registration form
  if (!attendee) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Complete Your Registration
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Hello, {user?.user_metadata?.full_name || user?.email}! Please complete your {userType} registration.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Registration Form */}
          {userType === 'professional' ? (
            <ProfessionalRegistrationForm onSuccess={handleRegistrationSuccess} />
          ) : (
            <StudentRegistrationForm onSuccess={handleRegistrationSuccess} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to VIBE Dashboard!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Hello, {user?.user_metadata?.full_name || user?.email}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Account Info</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email: {user?.email}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Provider: {user?.app_metadata?.provider || 'Unknown'}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Registration Status</h3>
              {attendee ? (
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 mb-1">
                    ✅ Registered as {attendee.user_type}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Registered on: {new Date(attendee.created_at).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
                    ⚠️ Not registered for the event
                  </p>
                  <button
                    onClick={() => router.push('/registration')}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Complete Registration
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Registration Details */}
          {attendee && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">
                Your Registration Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Name:</strong> {attendee.name}
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Email:</strong> {attendee.email}
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Mobile:</strong> {attendee.mobile}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Type:</strong> {attendee.user_type === 'professional' ? 'Professional' : 'Student'}
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Food Choice:</strong> {attendee.food_choice}
                  </p>
                  {attendee.user_type === 'professional' ? (
                    <>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Company:</strong> {attendee.company}
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Designation:</strong> {attendee.designation}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>College:</strong> {attendee.college}
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Education:</strong> {attendee.education_level} - {attendee.year_of_study}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Event Actions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Event Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/agenda"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-lg text-center font-medium transition-colors"
              >
                📅 View Event Agenda
              </a>
              <a
                href="/checkin"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-lg text-center font-medium transition-colors"
              >
                ✅ Check In to Event
              </a>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What's Next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                  📧 Check Email
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  We'll send you event updates and important information.
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  📅 Build Your Agenda
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Create your personalized agenda with sessions you want to attend.
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
                  🤝 Network
                </h4>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Connect with other participants and build your network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
