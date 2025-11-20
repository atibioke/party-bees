'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Loader2, PartyPopper } from 'lucide-react';
import { UserMenu } from '@/components/UserMenu';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success && data.data) {
          // User is already logged in, redirect to dashboard
          router.push('/dashboard');
        }
      } catch {
        // Not logged in, continue showing login page
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.success) {
        showToast('Login successful!', 'success');
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        const errorMsg = data.error || 'Login failed';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      }
    } catch {
      const errorMsg = 'An error occurred. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-lg shadow-lg shadow-pink-500/10 text-slate-900">
              <PartyPopper size={24} />
            </div>
            <span className="text-xl font-bold text-white">Skiboh</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/events" className="hidden md:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Browse Events
            </Link>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center pt-20 pb-10">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 -right-32 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl" />
        </div>

      {/* Card */}
      <div className="w-full max-w-md relative z-10 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Gradient header */}
        <div className="h-32 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="text-4xl mb-2 animate-bounce"> <PartyPopper size={24} />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">Skiboh</span>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-sm text-slate-400">Log in to continue your party journey.</p>
          </div>

          {/* Social logins - At the top */}
          <div>
            <button className="flex items-center justify-center gap-2 w-full py-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 text-slate-200 font-medium transition-colors">
              <FcGoogle className="text-xl" /> Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <hr className="flex-1 border-slate-700" />
            <span className="text-slate-500 text-sm font-medium">or continue with</span>
            <hr className="flex-1 border-slate-700" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                <Link href="/forgot-password" className="text-xs text-pink-500 hover:text-pink-400 font-medium">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold bg-gradient-to-r from-yellow-500 to-pink-600 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Links */}
          <div className="text-center text-sm text-slate-400 mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-pink-500 font-bold hover:text-pink-400 hover:underline transition-colors">
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
      </div>
      {checkingAuth && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-white"> <Loader2 size={16} /></div>
        </div>
      )}
    </main>
  );
}
