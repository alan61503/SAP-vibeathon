"use client";

import { useState } from 'react';
import { attendees, ProfessionalAttendee, StudentAttendee } from '@/lib/attendees';

interface RegistrationFormProps {
  onSuccess?: () => void;
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [userType, setUserType] = useState<'professional' | 'student'>('professional');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Professional form state
  const [professionalForm, setProfessionalForm] = useState({
    name: '',
    email: '',
    mobile: '',
    company: '',
    designation: '',
    food_choice: 'Veg' as 'Veg' | 'Non-Veg'
  });

  // Student form state
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    mobile: '',
    college: '',
    education_level: 'UG' as 'UG' | 'PG',
    year_of_study: '',
    food_choice: 'Veg' as 'Veg' | 'Non-Veg'
  });

  const handleProfessionalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!professionalForm.name || !professionalForm.email || !professionalForm.mobile || 
          !professionalForm.company || !professionalForm.designation || !professionalForm.food_choice) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      // Check if email already exists
      const { exists } = await attendees.checkEmailExists(professionalForm.email);
      if (exists) {
        setError('Email already registered');
        setLoading(false);
        return;
      }

      const attendeeData: ProfessionalAttendee = {
        ...professionalForm,
        user_type: 'professional',
        consent_notifications: true
      };

      const { error } = await attendees.createAttendee(attendeeData);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!studentForm.name || !studentForm.email || !studentForm.mobile || 
          !studentForm.college || !studentForm.year_of_study || !studentForm.food_choice) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      // Check if email already exists
      const { exists } = await attendees.checkEmailExists(studentForm.email);
      if (exists) {
        setError('Email already registered');
        setLoading(false);
        return;
      }

      const attendeeData: StudentAttendee = {
        ...studentForm,
        user_type: 'student',
        consent_notifications: true
      };

      const { error } = await attendees.createAttendee(attendeeData);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
        <div className="text-green-600 dark:text-green-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
          Registration Successful!
        </h3>
        <p className="text-green-700 dark:text-green-300">
          Thank you for registering. You will receive a confirmation email shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* User Type Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">VIBE Event Registration</h2>
        <div className="flex space-x-4 justify-center">
          <button
            type="button"
            onClick={() => setUserType('professional')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              userType === 'professional'
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Professional
          </button>
          <button
            type="button"
            onClick={() => setUserType('student')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              userType === 'student'
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Student
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Professional Form */}
      {userType === 'professional' && (
        <form onSubmit={handleProfessionalSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={professionalForm.name}
                onChange={(e) => setProfessionalForm({...professionalForm, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={professionalForm.email}
                onChange={(e) => setProfessionalForm({...professionalForm, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={professionalForm.mobile}
                onChange={(e) => setProfessionalForm({...professionalForm, mobile: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter your mobile number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company *
              </label>
              <input
                type="text"
                required
                value={professionalForm.company}
                onChange={(e) => setProfessionalForm({...professionalForm, company: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Designation *
              </label>
              <input
                type="text"
                required
                value={professionalForm.designation}
                onChange={(e) => setProfessionalForm({...professionalForm, designation: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter your designation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Food Choice *
              </label>
              <select
                required
                value={professionalForm.food_choice}
                onChange={(e) => setProfessionalForm({...professionalForm, food_choice: e.target.value as 'Veg' | 'Non-Veg'})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select food preference</option>
                <option value="Veg">Vegetarian</option>
                <option value="Non-Veg">Non-Vegetarian</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register as Professional'}
          </button>
        </form>
      )}

      {/* Student Form */}
      {userType === 'student' && (
        <form onSubmit={handleStudentSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={studentForm.name}
                onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={studentForm.email}
                onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={studentForm.mobile}
                onChange={(e) => setStudentForm({...studentForm, mobile: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter your mobile number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                College/University *
              </label>
              <input
                type="text"
                required
                value={studentForm.college}
                onChange={(e) => setStudentForm({...studentForm, college: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter your college/university name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Education Level *
              </label>
              <select
                required
                value={studentForm.education_level}
                onChange={(e) => setStudentForm({...studentForm, education_level: e.target.value as 'UG' | 'PG'})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Year of Study *
              </label>
              <input
                type="text"
                required
                value={studentForm.year_of_study}
                onChange={(e) => setStudentForm({...studentForm, year_of_study: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="e.g., 2nd Year, Final Year"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Food Choice *
              </label>
              <select
                required
                value={studentForm.food_choice}
                onChange={(e) => setStudentForm({...studentForm, food_choice: e.target.value as 'Veg' | 'Non-Veg'})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select food preference</option>
                <option value="Veg">Vegetarian</option>
                <option value="Non-Veg">Non-Vegetarian</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register as Student'}
          </button>
        </form>
      )}
    </div>
  );
}
