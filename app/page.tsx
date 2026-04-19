'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import AuthShell from '../components/AuthShell';
import { loginAction } from './actions/auth';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const confirmed = searchParams.get('confirmed');
  const urlError = searchParams.get('error');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const fd = new FormData(event.currentTarget);
      const email = fd.get('email');
      const password = fd.get('password');
      console.log('[LoginForm] submitting form with email:', email, 'password length:', (password as string)?.length);
      const result = await loginAction(fd);
      console.log('[LoginForm] result:', result);

      if (result?.error) {
        console.error('[LoginForm] error returned:', result.error);
        setError(result.error);
        setLoading(false);
      } else if (result && 'success' in result && result.success) {
        console.log('[LoginForm] success! navigating to dashboard');
        // Use window.location for a hard redirect to ensure it works in all environments
        window.location.href = '/dashboard';
      } else {
        console.warn('[LoginForm] unexpected result:', result);
        // If we get here, assume success and try redirecting anyway
        console.log('[LoginForm] no error and no explicit success, attempting redirect');
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('[LoginForm] exception:', err);
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome Back"
      description="Continue your journey of making an impact today."
      footerRightLabel="Verified"
    >
      {confirmed === 'true' && (
        <p className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-center text-[10px] font-semibold text-green-700">
          Email confirmed! Your account is currently under review.
        </p>
      )}

      {urlError === 'confirmation_failed' && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-center text-[10px] font-semibold text-red-700">
          Email confirmation failed or the link has expired. Please request a new one.
        </p>
      )}

      {urlError === 'missing_code' && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-center text-[10px] font-semibold text-red-700">
          Invalid confirmation link. Please use the link from your email.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.05em] text-[#7f6763]">Email Address</span>
          <div className="flex h-[48px] items-center gap-3 rounded-full bg-[#f5f2f1] px-5">
            <Mail size={16} className="text-[#bcb3b0]" />
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              className="w-full bg-transparent text-[13px] font-medium text-[#6d4a44] outline-none placeholder:text-[#bdb1ae]"
              required
            />
          </div>
        </label>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.05em] text-[#7f6763]">Password</span>
            <button type="button" className="text-[11px] font-semibold text-[#f0a4a0]">
              Forgot Password?
            </button>
          </div>
          <div className="flex h-[48px] items-center gap-3 rounded-full bg-[#f5f2f1] px-5">
            <Lock size={16} className="text-[#bcb3b0]" />
            <input
              type="password"
              name="password"
              placeholder="........"
              className="w-full bg-transparent text-[13px] font-medium text-[#6d4a44] outline-none placeholder:text-[#8f7f7b]"
              required
            />
          </div>
        </div>

        {error && (
          <p className="text-center text-[9px] font-bold uppercase tracking-wider text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#a6493f] text-[13px] font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(166,73,63,0.28)] transition hover:bg-[#963f37] disabled:opacity-60"
        >
          {loading ? 'Signing In...' : 'Sign In'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>

      <p className="mt-8 text-center text-[13px] text-[#8f817d]">
        Don&apos;t have an account?{' '}
        <Link href="/create-account" className="font-semibold text-[#f0a4a0]">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthShell title="Welcome Back" description="Continue your journey of making an impact today." footerRightLabel="Verified"><div /></AuthShell>}>
      <LoginForm />
    </Suspense>
  );
}
