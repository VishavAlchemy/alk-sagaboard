'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import { Gloria_Hallelujah } from 'next/font/google';
import { useAuthActions } from "@convex-dev/auth/react";

const gloria = Gloria_Hallelujah({
  weight: '400',
  subsets: ['latin'],
})

// Client-side validation functions
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Please enter a valid email address');
  }
};

const validatePassword = (password: string) => {
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    throw new Error('Password must contain at least one number');
  }
};

export const SignUp = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuthActions();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Client-side validation
      if (!formData.name.trim()) {
        throw new Error('Please enter your name');
      }
      validateEmail(formData.email);
      validatePassword(formData.password);

      console.log('Starting authentication with Convex...');
      
      // Use the local proxy endpoint instead of direct Convex URL
      // This will be intercepted by our API route handler
      
      // Sign up with Convex
      const result = await signIn("password", {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        flow: "signUp",
        // Remove custom URL - let the system use the default
        // which will go through our Next.js API route
      }).catch((err) => {
        console.error('Authentication error details:', err);
        
        // Handle specific Convex errors
        if (err.message.includes('<!DOCTYPE')) {
          throw new Error('Authentication service is not properly configured. Please check your Convex setup.');
        }
        if (err.message.includes('Unexpected end of JSON input')) {
          throw new Error('Authentication service returned an invalid response. Please try again later.');
        }
        throw err;
      });

      if (!result) {
        throw new Error('Failed to create account. Please try again.');
      }

      console.log('Authentication successful');
      
      // If successful, redirect to dashboard
      router.push('/');
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[300px] bg-white rounded-lg shadow-sm p-6">
      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex flex-col items-center">
            <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-black rounded-full mb-2"></div>
            <p className="text-sm text-gray-600">Creating your account...</p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="text-center mb-5 flex flex-col items-center">
        <Image src="/space.svg" alt="Logo" width={50} height={50} />
        <h1 className={`${gloria.className} text-xl font-medium text-gray-800`}>Welcome to Space</h1>
        <p className="text-[10px] text-gray-500 mb-10">Begin by creating an account</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name Input */}
        <div>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="w-full rounded-full text-black px-4 py-3 text-[10px] bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-all"
            required
          />
        </div>

        {/* Email Input */}
        <div>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full rounded-full text-black px-4 py-3 text-[10px] bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-all"
            required
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="w-full px-3 text-black px-4 py-3 text-[10px] rounded-full bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-all"
            required
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Password Requirements */}
        <div className="text-[8px] text-gray-500 space-y-1 mt-1">
          <p>Password must:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Be at least 8 characters long</li>
            <li>Contain at least one uppercase letter</li>
            <li>Contain at least one number</li>
          </ul>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-xs mt-1 p-2 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        {/* Terms and Privacy */}
        <div className="text-[6px] text-gray-500 text-center mt-2 mb-10">
          By continuing, you agree to our{' '} <br />
          <Link href="/terms" className="text-gray-700 hover:underline">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-gray-700 hover:underline">Privacy Policy</Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white text-[10px] py-2.5 px-4 rounded-full hover:bg-gray-800 transition-colors duration-200 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Account...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}; 