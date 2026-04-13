'use client';

import { useEffect } from 'react';

interface ContactErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ContactError({ error, reset }: ContactErrorProps) {
  useEffect(() => {
    console.error('Contact page error:', error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">We could not load the contact page. Please try again.</p>
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-3 rounded-full font-semibold transition-all bg-green-900 text-white hover:bg-green-800"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
