'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center bg-gray-50 px-4 py-20">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Something went wrong</h1>
        <p className="mb-8 text-gray-600">
          We couldn&apos;t load this page. Please try again or return to the home page.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-[#1e3c2c] px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-[#162e22]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border-2 border-[#1e3c2c] px-6 py-3 font-semibold text-[#1e3c2c] transition-all duration-300 hover:bg-[#1e3c2c] hover:text-white"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
