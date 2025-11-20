'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export default function SignupPage() {
  const [form, setForm] = useState({
    businessName: '',
    businessEmail: '',
    whatsapp: '',
    password: '',
    confirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { showToast } = useToast();

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

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: form.businessName,
          email: form.businessEmail,
          whatsapp: form.whatsapp,
          password: form.password
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
    <main className="relative min-h-screen flex items-center justify-center bg-slate-950 text-white overflow-hidden py-10">
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
          <div className="text-4xl mb-2 animate-bounce">🍯</div>
          <span className="text-2xl font-bold text-white tracking-tight">Skiboh</span>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Organizer Account</h1>
            <p className="text-sm text-slate-400">Create an account to start hosting events.</p>
          </div>

          {/* Social logins - Moved to top */}
          <div>
            <button className="flex items-center justify-center gap-2 w-full py-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 text-slate-200 font-medium transition-colors">
              <FcGoogle className="text-xl" /> Continue with Google
            </button>
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
    </main>
  );
}
