"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";

type UserType = 'professional' | 'student' | null;
type SignupStep = 'userType' | 'account' | 'registration';

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState<SignupStep>('userType');
  const [userType, setUserType] = useState<UserType>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const router = useRouter();

  const handleUserTypeSelection = (type: UserType) => {
    setUserType(type);
    setCurrentStep('account');
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!agreeToTerms) {
      setError("Please agree to the Terms and Conditions and Privacy Policy.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await auth.signUp(email, password);
      
      if (error) {
        setError(error.message || "Failed to create account. Please try again.");
      } else if (data.user) {
        setSuccess(true);
        // Store user type in localStorage for registration step
        localStorage.setItem('userType', userType || '');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);
        // Redirect to registration form
        setTimeout(() => {
          router.push(`/registration?type=${userType}`);
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, show a message that Google auth needs to be configured
      setError("Google authentication is not yet configured. Please use email/password.");
    } catch (err) {
      setError("Google sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignUp = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, show a message that GitHub auth needs to be configured
      setError("GitHub authentication is not yet configured. Please use email/password.");
    } catch (err) {
      setError("GitHub sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const renderUserTypeSelection = () => (
    <div className="shadow-three mx-auto max-w-[600px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
      <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
        Join SAP Vibeathon
      </h3>
      <p className="mb-8 text-center text-base font-medium text-body-color">
        Choose your registration type to get started
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={() => handleUserTypeSelection('professional')}
          className="group p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-300"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Professional</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Industry professionals, working individuals, and career-focused participants
            </p>
          </div>
        </button>

        <button
          onClick={() => handleUserTypeSelection('student')}
          className="group p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-300"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Student</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Students, graduates, and those pursuing education in technology
            </p>
          </div>
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );

  const renderAccountForm = () => (
    <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
      <div className="mb-6">
        <button
          onClick={() => setCurrentStep('userType')}
          className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to user type selection
        </button>
      </div>

      <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
        Create your account
      </h3>
      <p className="mb-4 text-center text-base font-medium text-body-color">
        Registering as: <span className="text-primary font-semibold capitalize">{userType}</span>
      </p>
      <p className="mb-11 text-center text-sm text-body-color">
        It's totally free and super easy
      </p>
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-700 dark:text-green-300 text-sm">
            Account created successfully! Redirecting to registration...
          </p>
        </div>
      )}

      <form onSubmit={handleAccountSubmit}>
        <div className="mb-8">
          <label
            htmlFor="name"
            className="mb-3 block text-sm text-dark dark:text-white"
          >
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
            className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
          />
        </div>
        <div className="mb-8">
          <label
            htmlFor="email"
            className="mb-3 block text-sm text-dark dark:text-white"
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
          />
        </div>
        <div className="mb-8">
          <label
            htmlFor="password"
            className="mb-3 block text-sm text-dark dark:text-white"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            minLength={6}
            className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
          />
        </div>
        <div className="mb-8 flex">
          <label
            htmlFor="checkboxLabel"
            className="flex cursor-pointer select-none text-sm font-medium text-body-color"
          >
            <div className="relative">
              <input
                type="checkbox"
                id="checkboxLabel"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="sr-only"
              />
              <div className="box mr-4 mt-1 flex h-5 w-5 items-center justify-center rounded border border-body-color border-opacity-20 dark:border-white dark:border-opacity-10">
                <span className="opacity-0">
                  <svg
                    width="11"
                    height="8"
                    viewBox="0 0 11 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                      fill="#3056D3"
                      stroke="#3056D3"
                      strokeWidth="0.4"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <span>
              By creating account means you agree to the
              <a href="#0" className="text-primary hover:underline">
                {" "}
                Terms and Conditions{" "}
              </a>
              , and our
              <a href="#0" className="text-primary hover:underline">
                {" "}
                Privacy Policy{" "}
              </a>
            </span>
          </label>
        </div>
        <div className="mb-6">
          <button 
            type="submit"
            disabled={loading}
            className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account & Continue'}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              {currentStep === 'userType' && renderUserTypeSelection()}
              {currentStep === 'account' && renderAccountForm()}
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_95:1005"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="969"
            >
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_95:1005)">
              <path
                opacity="0.1"
                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                fill="url(#paint0_linear_95:1005)"
              />
              <path
                opacity="0.1"
                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                fill="url(#paint1_linear_95:1005)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_95:1005"
                x1="1178.4"
                y1="151.853"
                x2="780.959"
                y2="453.581"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_95:1005"
                x1="160.5"
                y1="220"
                x2="1099.45"
                y2="1192.04"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
}
