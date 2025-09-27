"use client";

import { useState, useEffect } from 'react';
import { attendees } from '@/lib/attendees';

interface UserDashboardProps {
  attendee: any;
  onLogout: () => void;
}

export default function UserDashboard({ attendee, onLogout }: UserDashboardProps) {
  const [allAttendees, setAllAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllAttendees();
  }, []);

  const fetchAllAttendees = async () => {
    setLoading(true);
    try {
      const { data, error } = await attendees.getAllAttendees();
      if (error) {
        setError(error.message);
      } else {
        setAllAttendees(data || []);
      }
    } catch (err) {
      setError('Failed to fetch attendees');
    } finally {
      setLoading(false);
    }
  };

  const getAttendeeTypeCount = (type: string) => {
    return allAttendees.filter(attendee => attendee.user_type === type).length;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome, {attendee.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {attendee.user_type === 'professional' 
                ? `Professional - ${attendee.designation} at ${attendee.company}`
                : `Student - ${attendee.education_level} at ${attendee.college}`
              }
            </p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* User Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contact Info</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Email: {attendee.email}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Mobile: {attendee.mobile}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Registration Details</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Type: {attendee.user_type === 'professional' ? 'Professional' : 'Student'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Food: {attendee.food_choice}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Registration Date</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(attendee.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Event Statistics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {allAttendees.length}
              </div>
              <div className="text-blue-800 dark:text-blue-300">Total Registrations</div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {getAttendeeTypeCount('professional')}
              </div>
              <div className="text-green-800 dark:text-green-300">Professionals</div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {getAttendeeTypeCount('student')}
              </div>
              <div className="text-purple-800 dark:text-purple-300">Students</div>
            </div>
          </div>
        </div>

        {/* Attendees List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Attendees</h2>
            <button
              onClick={fetchAllAttendees}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">Name</th>
                  <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">Email</th>
                  <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">Type</th>
                  <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">Food Choice</th>
                  <th className="px-4 py-3 font-medium text-gray-900 dark:text-white">Registered</th>
                </tr>
              </thead>
              <tbody>
                {allAttendees.map((attendee, index) => (
                  <tr key={attendee.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{attendee.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{attendee.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        attendee.user_type === 'professional'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}>
                        {attendee.user_type === 'professional' ? 'Professional' : 'Student'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 capitalize">
                      {attendee.food_choice}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {new Date(attendee.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
