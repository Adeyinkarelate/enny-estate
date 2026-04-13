'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface AboutErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AboutError({ error, reset }: AboutErrorProps) {
  useEffect(() => {
    console.error('About page error:', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center bg-gray-50 px-4 py-16">
      <p className="text-lg font-medium text-gray-900 mb-2">Something went wrong</p>
      <p className="text-gray-600 text-center max-w-md mb-6">
        We couldn&apos;t load this page. Please try again or return home.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => {
            reset();
          }}
          className="px-6 py-3 rounded-full font-semibold transition-all bg-green-900 text-white hover:bg-green-800"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-full font-semibold transition-all border border-gray-300 text-gray-900 hover:bg-gray-100"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
