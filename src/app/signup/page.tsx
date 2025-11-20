'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Loader2, PartyPopper } from 'lucide-react';
import { UserMenu } from '@/components/UserMenu';

export default function SignupPage() {
  const [form, setForm] = useState({
    businessName: '',
    businessEmail: '',
    whatsapp: '',
    password: '',
    confirm: '',
    acceptedTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.data) {
          // User is already logged in, redirect to dashboard
          router.push('/dashboard');
        }
      } catch {
        // Not logged in, continue showing signup page
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

    if (form.password !== form.confirm) {
      const errorMsg = "Passwords don't match";
      setError(errorMsg);
      showToast(errorMsg, 'error');
      setLoading(false);
      return;
    }

    if (!form.acceptedTerms) {
      const errorMsg = 'You must accept the Terms and Conditions';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: form.businessName,
          email: form.businessEmail,
          whatsapp: form.whatsapp,
          password: form.password,
          acceptedTerms: form.acceptedTerms
        })
      });

      const data = await res.json();

      if (data.success) {
        showToast('Account created successfully!', 'success');
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        const errorMsg = data.error || 'Signup failed';
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
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-32 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Card */}
        <div className="w-full max-w-md relative z-10 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
          {/* Gradient header */}
          <div className="h-32 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="text-4xl mb-2 animate-bounce"> <PartyPopper size={24} /></div>
            <span className="text-2xl font-bold text-white tracking-tight">Skiboh</span>
          </div>

          <div className="p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-2">Organizer Account</h1>
              <p className="text-sm text-slate-400">Create an account to start hosting events.</p>
            </div>

            {/* Social logins - Moved to top */}
            <div>
              <a
                href="/api/auth/google"
                className="flex items-center justify-center gap-2 w-full py-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 text-slate-200 font-medium transition-colors"
              >
                <FcGoogle className="text-xl" /> Continue with Google
              </a>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <hr className="flex-1 border-slate-700" />
              <span className="text-slate-500 text-sm font-medium">or register with email</span>
              <hr className="flex-1 border-slate-700" />
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Business Name"
                type="text"
                placeholder="e.g. Party Kings Events"
                value={form.businessName}
                onChange={e => setForm({ ...form, businessName: e.target.value })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Business Email"
                  type="email"
                  placeholder="work@business.com"
                  value={form.businessEmail}
                  onChange={e => setForm({ ...form, businessEmail: e.target.value })}
                />

                <Input
                  label="WhatsApp Number"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={form.whatsapp}
                  onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                />
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={form.acceptedTerms}
                  onChange={e => setForm({ ...form, acceptedTerms: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-pink-500 focus:ring-pink-500 focus:ring-2 cursor-pointer"
                />
                <label htmlFor="acceptTerms" className="text-sm text-slate-300 cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms" target="_blank" className="text-pink-400 hover:text-pink-300 font-medium underline">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" target="_blank" className="text-pink-400 hover:text-pink-300 font-medium underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-xs text-yellow-200/80 leading-relaxed">
                <span className="font-bold text-yellow-500 block mb-1">⚠️ Verification Notice</span>
                For the security of our users, all organizer details will be verified. Please ensure your business information is accurate to avoid account suspension.
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-bold bg-gradient-to-r from-yellow-500 to-pink-600 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform hover:scale-[1.02] transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Links */}
            <div className="text-center text-sm text-slate-400 mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-pink-500 font-bold hover:text-pink-400 hover:underline transition-colors">
                Log in
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
