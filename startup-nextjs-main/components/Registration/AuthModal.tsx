"use client";

import { useState } from 'react';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (attendee: any) => void;
  onRegisterSuccess?: () => void;
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess, 
  onRegisterSuccess 
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold">
            {mode === 'login' ? 'Login' : 'Event Registration'}
          </h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {mode === 'login' ? (
            <LoginForm
              onSuccess={onLoginSuccess}
              onSwitchToRegister={() => setMode('register')}
            />
          ) : (
            <RegistrationForm
              onSuccess={() => {
                if (onRegisterSuccess) onRegisterSuccess();
                setMode('login');
              }}
            />
          )}

          {mode === 'register' && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Login here
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
