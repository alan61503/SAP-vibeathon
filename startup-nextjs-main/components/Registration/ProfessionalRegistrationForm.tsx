"use client";

import { useState } from 'react';
import { attendees, ProfessionalAttendee } from '@/lib/attendees';

interface ProfessionalRegistrationFormProps {
  onSuccess?: (attendee: any) => void;
  onCancel?: () => void;
}

export default function ProfessionalRegistrationForm({ onSuccess, onCancel }: ProfessionalRegistrationFormProps) {
  const [formData, setFormData] = useState<ProfessionalAttendee>({
    name: '',
    email: '',
    mobile: '',
    company: '',
    designation: '',
    food_choice: 'Veg',
    user_type: 'professional',
    country: '',
    gender: '',
    blood_group: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
    consent_notifications: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.mobile || !formData.company || !formData.designation) {
        setError('Please fill in all required fields (Name, Email, Mobile, Company, Designation)');
        setLoading(false);
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Basic mobile validation (should be numeric)
      const mobileRegex = /^[0-9+\-\s()]+$/;
      if (!mobileRegex.test(formData.mobile)) {
        setError('Please enter a valid mobile number');
        setLoading(false);
        return;
      }

      // Check if email already exists
      try {
        const { exists } = await attendees.checkEmailExists(formData.email);
        if (exists) {
          setError('An attendee with this email already exists');
          setLoading(false);
          return;
        }
      } catch (emailCheckError) {
        // Continue with registration even if email check fails
      }

      // Create attendee
      const { data, error } = await attendees.createAttendee(formData);
      
      if (error) {
        setError(error.message || 'Failed to register. Please try again.');
      } else if (data && data.length > 0) {
        setSuccess(true);
        if (onSuccess) onSuccess(data[0]);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
            <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Registration Successful!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Welcome to SAP Vibeathon! Your professional registration has been completed successfully.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
              <li>• Explore the agenda and select your sessions</li>
              <li>• Get AI-powered session recommendations</li>
              <li>• Network with industry professionals</li>
              <li>• Attend workshops and panel discussions</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.href = '/agenda'}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View Event Agenda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Professional Registration
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Complete your registration to join SAP Vibeathon as a professional attendee.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
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
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
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
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter your mobile number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Japan">Japan</option>
                <option value="Singapore">Singapore</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blood Group
              </label>
              <select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Professional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company/Organization *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Designation/Job Title *
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter your job title"
              />
            </div>
          </div>
        </div>

        {/* Event Preferences */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Event Preferences</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Food Preference *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="food_choice"
                    value="Veg"
                    checked={formData.food_choice === 'Veg'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Vegetarian</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="food_choice"
                    value="Non-Veg"
                    checked={formData.food_choice === 'Non-Veg'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Non-Vegetarian</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Emergency Contact</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Emergency Contact Name
              </label>
              <input
                type="text"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter emergency contact name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Emergency Contact Number
              </label>
              <input
                type="tel"
                name="emergency_contact_number"
                value={formData.emergency_contact_number}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter emergency contact number"
              />
            </div>
          </div>
        </div>

        {/* Consent */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              name="consent_notifications"
              checked={formData.consent_notifications}
              onChange={handleInputChange}
              className="mt-1 mr-3"
            />
            <label className="text-sm text-gray-700 dark:text-gray-300">
              I would like to receive updates & notifications from this event organizer
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
