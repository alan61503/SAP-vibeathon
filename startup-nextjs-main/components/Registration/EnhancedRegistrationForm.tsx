"use client";

import { useState } from 'react';
import { attendees, ProfessionalAttendee, StudentAttendee } from '@/lib/attendees';
import { emailService } from '@/lib/email';

interface EnhancedRegistrationFormProps {
  onSuccess?: () => void;
}

export default function EnhancedRegistrationForm({ onSuccess }: EnhancedRegistrationFormProps) {
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
    food_choice: 'Veg' as 'Veg' | 'Non-Veg',
    country: '',
    gender: '',
    blood_group: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
    consent_notifications: false
  });

  // Student form state
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    mobile: '',
    college: '',
    education_level: 'UG' as 'UG' | 'PG',
    year_of_study: '1',
    food_choice: 'Veg' as 'Veg' | 'Non-Veg',
    country: '',
    gender: '',
    blood_group: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
    consent_notifications: false
  });

  const handleProfessionalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!professionalForm.name || !professionalForm.email || !professionalForm.mobile || 
          !professionalForm.company || !professionalForm.designation || !professionalForm.food_choice) {
        setError('All required fields must be filled');
        setLoading(false);
        return;
      }

      if (!professionalForm.consent_notifications) {
        setError('Please accept the consent to receive notifications');
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
        user_type: 'professional'
      };

      const { data: createdAttendee, error } = await attendees.createAttendee(attendeeData);
      
      if (error) {
        setError(error.message);
      } else {
        // Send confirmation email
        try {
          const registrationId = createdAttendee?.[0]?.id || 'REG-' + Date.now();
          await emailService.sendConfirmationEmail({
            attendeeId: registrationId,
            name: professionalForm.name,
            email: professionalForm.email,
            userType: 'professional',
            registrationId: registrationId,
            qrCode: registrationId // QR code will be generated in the email service
          });
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          // Don't fail registration if email fails
        }
        
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
        setError('All required fields must be filled');
        setLoading(false);
        return;
      }

      if (!studentForm.consent_notifications) {
        setError('Please accept the consent to receive notifications');
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
        user_type: 'student'
      };

      const { data: createdAttendee, error } = await attendees.createAttendee(attendeeData);
      
      if (error) {
        setError(error.message);
      } else {
        // Send confirmation email
        try {
          const registrationId = createdAttendee?.[0]?.id || 'REG-' + Date.now();
          await emailService.sendConfirmationEmail({
            attendeeId: registrationId,
            name: studentForm.name,
            email: studentForm.email,
            userType: 'student',
            registrationId: registrationId,
            qrCode: registrationId // QR code will be generated in the email service
          });
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          // Don't fail registration if email fails
        }
        
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
          Thank you for registering for SAP Vibeathon. You will receive a confirmation email shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
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
            {/* Required Fields */}
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
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>
            </div>

            {/* Optional Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <input
                type="text"
                value={professionalForm.country}
                onChange={(e) => setProfessionalForm({...professionalForm, country: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter your country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </label>
              <select
                value={professionalForm.gender}
                onChange={(e) => setProfessionalForm({...professionalForm, gender: e.target.value})}
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
                value={professionalForm.blood_group}
                onChange={(e) => setProfessionalForm({...professionalForm, blood_group: e.target.value})}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={professionalForm.emergency_contact_name}
                onChange={(e) => setProfessionalForm({...professionalForm, emergency_contact_name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Emergency contact name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Emergency Contact Number
              </label>
              <input
                type="tel"
                value={professionalForm.emergency_contact_number}
                onChange={(e) => setProfessionalForm({...professionalForm, emergency_contact_number: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Emergency contact number"
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="professional-consent"
              required
              checked={professionalForm.consent_notifications}
              onChange={(e) => setProfessionalForm({...professionalForm, consent_notifications: e.target.checked})}
              className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="professional-consent" className="text-sm text-gray-700 dark:text-gray-300">
              I would like to receive updates & notifications from this event organizer *
            </label>
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
            {/* Required Fields */}
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
                College *
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
              <select
                required
                value={studentForm.year_of_study}
                onChange={(e) => setStudentForm({...studentForm, year_of_study: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
                <option value="6">6th Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Food Choice *
              </label>
              <select
                required
                value={studentForm.food_choice}
                onChange={(e) => setStudentForm({...studentForm, food_choice: e.target.value as 'Veg' | 'Non-Veg'})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>
            </div>

            {/* Optional Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <input
                type="text"
                value={studentForm.country}
                onChange={(e) => setStudentForm({...studentForm, country: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter your country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </label>
              <select
                value={studentForm.gender}
                onChange={(e) => setStudentForm({...studentForm, gender: e.target.value})}
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
                value={studentForm.blood_group}
                onChange={(e) => setStudentForm({...studentForm, blood_group: e.target.value})}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={studentForm.emergency_contact_name}
                onChange={(e) => setStudentForm({...studentForm, emergency_contact_name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Emergency contact name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Emergency Contact Number
              </label>
              <input
                type="tel"
                value={studentForm.emergency_contact_number}
                onChange={(e) => setStudentForm({...studentForm, emergency_contact_number: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Emergency contact number"
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="student-consent"
              required
              checked={studentForm.consent_notifications}
              onChange={(e) => setStudentForm({...studentForm, consent_notifications: e.target.checked})}
              className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="student-consent" className="text-sm text-gray-700 dark:text-gray-300">
              I would like to receive updates & notifications from this event organizer *
            </label>
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
