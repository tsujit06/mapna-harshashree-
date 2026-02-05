'use client';

import * as React from 'react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

type PageProps = {
  params?: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[]>>;
};

export default function LoginPage(props: PageProps) {
  if (props.params) React.use(props.params);
  if (props.searchParams) React.use(props.searchParams);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo:
            typeof window !== 'undefined'
              ? `${window.location.origin}/dashboard`
              : undefined,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
      // On success, Supabase will redirect; no need to clear loading here.
    } catch (err: any) {
      console.error('Google login error:', err);
      setError('Failed to start Google login. Please try again.');
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Login to manage your QRgency account">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-800">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-zinc-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-zinc-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </motion.button>

          <div className="flex items-center gap-3 my-2">
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
              or
            </span>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          </div>

          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-zinc-800 dark:text-zinc-100 py-3 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-sm">Continue with Google</span>
          </motion.button>

          <p className="text-center text-sm text-zinc-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-red-600 font-bold hover:underline">
              Register now
            </Link>
          </p>
        </form>
      </motion.div>
    </AuthLayout>
  );
}
