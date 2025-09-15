'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-50 to-white overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-yellow-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl" />

      {/* Card */}
      <div className="w-full max-w-md relative z-10 bg-white/90 rounded-3xl shadow-2xl overflow-hidden">
        {/* Gradient header */}
        <div className="h-32 bg-gradient-to-r from-yellow-400 to-pink-500 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">🐝 Party Bees</span>
        </div>

        <div className="p-8 space-y-6">
          <h1 className="text-2xl font-bold text-yellow-700">Welcome Back</h1>
          <p className="text-sm text-slate-600">Log in to continue to Party Bees.</p>

                  <form className="space-y-4">
                      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
             className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-yellow-200/70 focus:border-yellow-400 outline-none transition"
                      />
                      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
             className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-yellow-200/70 focus:border-yellow-400 outline-none transition"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-yellow-400 to-pink-500 shadow-lg hover:shadow-2xl transform hover:scale-[1.03] transition"
            >
              Log In
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
            <button className="flex items-center justify-center text-slate-700 gap-2 w-full py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
              <FcGoogle className="text-xl" /> Continue with Google
            </button>
            <button className="flex items-center justify-center text-slate-700 gap-2 w-full py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
              <FaApple className="text-xl" /> Continue with Apple
            </button>
          </div>

          {/* Links */}
          <div className="flex items-center justify-between text-sm text-slate-600">
            <Link href="/forgot-password" className="hover:underline">
              Forgot password?
            </Link>
            <Link href="/signup" className="text-yellow-600 font-semibold hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
