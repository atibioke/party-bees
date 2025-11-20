'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PartyPopper } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { validateNigerianPhone } from '@/utils/phone';

export default function ProfileSetupPage() {
  const [form, setForm] = useState({ businessName: '', whatsapp: '' });
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();

  // Check if user needs to complete profile
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await res.json();

        if (!data.success || !data.data) {
          // Not authenticated, redirect to login
          router.push('/login');
          return;
        }

        // If profile is already completed, redirect to dashboard
        if (data.data.profileCompleted) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Check profile error:', error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!form.businessName || !form.whatsapp) {
      showToast('Please fill in all fields', 'error');
      setLoading(false);
      return;
    }

    // Validate Nigerian phone number
    const phoneValidation = validateNigerianPhone(form.whatsapp);
    if (!phoneValidation.isValid) {
      showToast(phoneValidation.error || 'Invalid phone number', 'error');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: form.businessName,
          whatsapp: phoneValidation.formatted
        })
      });

      const data = await res.json();

      if (data.success) {
        showToast('Profile completed successfully!', 'success');
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        showToast(data.error || 'Failed to complete profile', 'error');
      }
    } catch (error) {
      console.error('Profile setup error:', error);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </main>
    );
  }

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
        <div className="w-full max-w-md relative z-10 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden mx-4">
          {/* Gradient header */}
          <div className="h-32 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="text-4xl mb-2 animate-bounce">
              <PartyPopper size={32} />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Complete Your Profile</span>
          </div>

          <div className="p-8 space-y-6">
            <div className="text-center">
              <p className="text-slate-300">
                Just a few more details to get started with Skiboh!
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Business Name"
                type="text"
                placeholder="e.g. Party Kings Events"
                value={form.businessName}
                onChange={e => setForm({ ...form, businessName: e.target.value })}
                required
              />

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="+234 800 000 0000 or 0800 000 0000"
                  value={form.whatsapp}
                  onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                  onBlur={e => {
                    const validation = validateNigerianPhone(e.target.value);
                    if (validation.isValid && validation.formatted) {
                      setForm({ ...form, whatsapp: validation.formatted });
                    }
                  }}
                  className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-pink-500 transition-colors"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Format: +234 800 000 0000 or 0800 000 0000</p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-xs text-blue-200/80 leading-relaxed">
                <span className="font-bold text-blue-400 block mb-1">ℹ️ Why we need this</span>
                This information helps us create your organizer profile and allows attendees to contact you for events.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-white font-bold bg-gradient-to-r from-yellow-500 to-pink-600 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Saving...' : 'Complete Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
