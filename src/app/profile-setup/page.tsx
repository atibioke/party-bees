'use client';

import { useState } from 'react';

export default function ProfileSetupPage() {
  const [form, setForm] = useState({ username: '', location: '', interests: '' });

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-50 to-white overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-28 -right-20 w-72 h-72 bg-yellow-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -left-32 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl" />

      {/* Card */}
      <div className="w-full max-w-md relative z-10 bg-white/90 rounded-3xl shadow-2xl overflow-hidden">
        {/* Gradient header */}
        <div className="h-32 bg-gradient-to-r from-yellow-400 to-pink-500 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">🐝 Party Bees</span>
        </div>

        <div className="p-8 space-y-6">
          <h1 className="text-2xl font-bold text-yellow-700">Set Up Your Profile</h1>
          <p className="text-sm text-slate-600">Tell us more about you to personalize your Party Bees experience.</p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-yellow-200/70 focus:border-yellow-400 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-yellow-200/70 focus:border-yellow-400 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Interests</label>
              <textarea
                value={form.interests}
                onChange={e => setForm({ ...form, interests: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-yellow-200/70 focus:border-yellow-400 outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-yellow-400 to-pink-500 shadow-lg hover:shadow-2xl transform hover:scale-[1.03] transition"
            >
              Finish Setup
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
