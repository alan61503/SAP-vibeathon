"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";

export default function UserTypeSelectionPage() {
  const [selectedType, setSelectedType] = useState<'professional' | 'student' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUserTypeSelection = async (userType: 'professional' | 'student') => {
    setLoading(true);
    setError(null);

    try {
      // Store user type in localStorage for now (in production, you'd store this in the database)
      localStorage.setItem('userType', userType);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to save user type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to SAP Vibeathon!
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please select your profile type to continue with registration
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Professional Option */}
          <div
            onClick={() => setSelectedType('professional')}
            className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 ${
              selectedType === 'professional'
                ? 'border-primary bg-primary/5 shadow-lg'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Professional
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                I'm a working professional looking to enhance my skills and network with industry experts.
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                <li>• Industry experience</li>
                <li>• Business-focused sessions</li>
                <li>• Networking opportunities</li>
                <li>• Career development</li>
              </ul>
            </div>
            {selectedType === 'professional' && (
              <div className="absolute top-2 right-2">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Student Option */}
          <div
            onClick={() => setSelectedType('student')}
            className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 ${
              selectedType === 'student'
                ? 'border-primary bg-primary/5 shadow-lg'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Student
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                I'm a student eager to learn new technologies and explore career opportunities.
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                <li>• Technical workshops</li>
                <li>• Career guidance</li>
                <li>• Internship opportunities</li>
                <li>• Peer networking</li>
              </ul>
            </div>
            {selectedType === 'student' && (
              <div className="absolute top-2 right-2">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => selectedType && handleUserTypeSelection(selectedType)}
            disabled={!selectedType || loading}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Continue to Registration'}
          </button>
          
          <button
            onClick={handleSignOut}
            className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            You can change your profile type later in your account settings
          </p>
        </div>
      </div>
    </div>
  );
}
