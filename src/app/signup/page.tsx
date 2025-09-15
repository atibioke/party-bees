'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-50 to-white overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl" />

      {/* Card */}
      <div className="w-full max-w-md relative z-10 bg-white/90 rounded-3xl shadow-2xl overflow-hidden">
        {/* Gradient header */}
        <div className="h-32 bg-gradient-to-r from-yellow-400 to-pink-500 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">🐝 Party Bees</span>
        </div>

        <div className="p-8 space-y-6">
          <h1 className="text-2xl font-bold text-yellow-700">Create Your Account</h1>
          <p className="text-sm text-slate-600">Join Party Bees and never miss a vibe.</p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-yellow-200/70 focus:border-yellow-400 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-yellow-200/70 focus:border-yellow-400 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-yellow-200/70 focus:border-yellow-400 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-yellow-200/70 focus:border-yellow-400 outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-yellow-400 to-pink-500 shadow-lg hover:shadow-2xl transform hover:scale-[1.03] transition"
            >
              Sign Up
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <hr className="flex-1 border-slate-300" />
            <span className="text-slate-500 text-sm">or</span>
            <hr className="flex-1 border-slate-300" />
          </div>

          {/* Social logins */}
          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center gap-2 w-full text-slate-700 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition">
              <FcGoogle className="text-xl" /> Continue with Google
            </button>
            <button className="flex items-center justify-center gap-2 w-full text-slate-700 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition">
              <FaApple className="text-xl" /> Continue with Apple
            </button>
          </div>

          {/* Links */}
          <div className="flex justify-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="ml-1 text-yellow-600 font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
