'use client';

import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, Lock, Shield } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/animations';
import toast from 'react-hot-toast';
import type { AdminLoginApiResponse } from '@/types';

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTarget = searchParams.get('redirect');
  const safeRedirect =
    redirectTarget && redirectTarget.startsWith('/') && !redirectTarget.startsWith('//')
      ? redirectTarget
      : '/admin';

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ password }),
        });
        const json = (await response.json()) as AdminLoginApiResponse;
        if (!response.ok || !json.success) {
          toast.error(json.error ?? 'Could not sign in');
          return;
        }
        toast.success('Signed in');
        router.push(safeRedirect);
        router.refresh();
      } catch {
        toast.error('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [password, router, safeRedirect]
  );

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <motion.div
        className="max-w-md w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden p-8 sm:p-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div className="flex flex-col items-center text-center mb-8" variants={fadeUp}>
          <div className="rounded-full bg-[#1e3c2c]/10 p-4 mb-4">
            <Shield className="h-10 w-10 text-[#1e3c2c]" aria-hidden />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-heading">
            Admin sign in
          </h1>
          <p className="text-gray-600 text-sm">
            Enter the admin password to manage properties and inquiries.
          </p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="space-y-6" variants={fadeUp}>
          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                aria-hidden
              />
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3c2c]/30 focus:border-[#1e3c2c] transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-full font-semibold transition-all bg-[#1e3c2c] text-white hover:bg-[#2d5a3f] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </motion.form>

        <motion.p className="mt-8 text-center" variants={fadeUp}>
          <Link
            href="/"
            className="text-sm font-medium text-[#1e3c2c] hover:text-[#2d5a3f] transition-colors"
          >
            ← Back to site
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
