"use client";

import { useState, useEffect } from 'react';
import { attendees } from '@/lib/attendees';
import QRCodeScanner from './QRCodeScanner';

interface CheckInSystemProps {
  attendeeId?: string;
  isStaffView?: boolean;
}

export default function CheckInSystem({ attendeeId, isStaffView = false }: CheckInSystemProps) {
  const [attendee, setAttendee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (attendeeId) {
      fetchAttendeeDetails();
    } else {
      setLoading(false);
    }
  }, [attendeeId]);

  const fetchAttendeeDetails = async () => {
    try {
      const { data, error } = await attendees.getAttendeeByEmail(attendeeId);
      if (error) {
        setError('Failed to fetch attendee details');
      } else {
        setAttendee(data);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    setError(null);

    try {
      const { error } = await attendees.checkInAttendee(attendeeId);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setAttendee({ ...attendee, checked_in: true, check_in_time: new Date().toISOString() });
      }
    } catch (err) {
      setError('Check-in failed. Please try again.');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleQRCheckInSuccess = (attendeeData: any) => {
    setAttendee(attendeeData);
    setSuccess(true);
    setShowScanner(false);
  };

  const handleQRCheckInError = (errorMessage: string) => {
    setError(errorMessage);
    setShowScanner(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !attendee) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-700 dark:text-red-300">{error}</p>
      </div>
    );
  }

  if (!attendee) {
    if (isStaffView) {
      return (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Event Check-In System
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Scan QR codes or manually check in attendees
            </p>
          </div>
          
          {showScanner ? (
            <QRCodeScanner 
              onCheckInSuccess={handleQRCheckInSuccess}
              onCheckInError={handleQRCheckInError}
            />
          ) : (
            <div className="text-center">
              <button
                onClick={() => setShowScanner(true)}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                📱 Start QR Code Scanning
              </button>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Attendee Not Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please make sure you're registered for the event.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Event Check-In
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome to SAP Vibeathon! Please check in to confirm your attendance.
          </p>
        </div>

        {/* Attendee Details */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Registration Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
              <p className="font-medium text-gray-900 dark:text-white">{attendee.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-white">{attendee.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {attendee.user_type === 'professional' ? 'Professional' : 'Student'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Food Choice</p>
              <p className="font-medium text-gray-900 dark:text-white">{attendee.food_choice}</p>
            </div>
            {attendee.user_type === 'professional' ? (
              <>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Company</p>
                  <p className="font-medium text-gray-900 dark:text-white">{attendee.company}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Designation</p>
                  <p className="font-medium text-gray-900 dark:text-white">{attendee.designation}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">College</p>
                  <p className="font-medium text-gray-900 dark:text-white">{attendee.college}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Education</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {attendee.education_level} - {attendee.year_of_study}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Check-in Status */}
        {attendee.checked_in ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
            <div className="text-green-600 dark:text-green-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
              Checked In Successfully!
            </h3>
            <p className="text-green-700 dark:text-green-300 mb-4">
              You have successfully checked in to the event.
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              Check-in time: {new Date(attendee.check_in_time).toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="text-center">
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {success ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <div className="text-green-600 dark:text-green-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                  Check-in Successful!
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  Welcome to SAP Vibeathon! You're all set for the event.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Ready to Check In?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Click the button below to check in to the event and receive your event materials.
                </p>
                <button
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkingIn ? 'Checking In...' : 'Check In Now'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Event Information */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">
            Event Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-800 dark:text-blue-200 font-medium">Date</p>
              <p className="text-blue-700 dark:text-blue-300">January 15, 2024</p>
            </div>
            <div>
              <p className="text-blue-800 dark:text-blue-200 font-medium">Time</p>
              <p className="text-blue-700 dark:text-blue-300">9:00 AM - 5:00 PM</p>
            </div>
            <div>
              <p className="text-blue-800 dark:text-blue-200 font-medium">Venue</p>
              <p className="text-blue-700 dark:text-blue-300">SAP Innovation Center</p>
            </div>
            <div>
              <p className="text-blue-800 dark:text-blue-200 font-medium">Dress Code</p>
              <p className="text-blue-700 dark:text-blue-300">Business Casual</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
