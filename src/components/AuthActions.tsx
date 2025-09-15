'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

const Brand = {
  bg: 'bg-gradient-to-r from-yellow-400 to-pink-500',
  ring: 'ring-yellow-300/40',
  accent: 'text-yellow-600',
  hover: 'hover:translate-y-[-2px] hover:shadow-2xl',
};

export default function AuthActions() {
  const router = useRouter();

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-3 items-center justify-center">
      {/* Sign up (Primary) */}
      <Link
        href="/signup"
        className={`inline-flex items-center justify-center gap-3 px-6 py-3 rounded-2xl text-white font-semibold ${Brand.bg} shadow-lg transform transition ${Brand.hover} focus:outline-none focus:ring-4 ${Brand.ring}`}
        aria-label="Sign up"
      >
        {/* simple bee icon */}
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2c1.1 0 2 .9 2 2 0 .52-.2 1-.53 1.37L17 9l-3 3-3-3 5-3.63A2 2 0 0012 4c-1.1 0-2-.9-2-2s.9-2 2-2zM4 13c0-1.1.9-2 2-2h3v6H6a2 2 0 01-2-2v-2zM14 11h3a2 2 0 012 2v2a2 2 0 01-2 2h-3v-6zM9 11h6v6H9v-6z" />
        </svg>
        Sign Up
      </Link>

      {/* Login (Secondary) */}
      <Link
        href="/login"
        className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-yellow-700 bg-white shadow-sm border border-yellow-200 font-medium transition transform ${Brand.hover} focus:outline-none focus:ring-4 ${Brand.ring}`}
        aria-label="Login"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M10 17l5-5-5-5v10zM4 19h8v2H4a2 2 0 01-2-2V5a2 2 0 012-2h8v2H4v14z" />
        </svg>
        Log in
      </Link>

      {/* Profile Setup (Tertiary - first-time) */}
      <button
        onClick={() => router.push('/profile-setup')}
        className="inline-flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-white/60 border border-dashed border-yellow-200 text-slate-700 font-medium shadow-sm transition transform hover:scale-[1.01] focus:outline-none focus:ring-4 ring-yellow-200/40"
        aria-label="Profile setup"
        title="Complete your profile — interests, location and more"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-yellow-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-3.9 0-8 2.0-8 6v2h16v-2c0-4-4.1-6-8-6z" />
          </svg>
          <span>Profile Setup</span>
        </div>

        {/* small badge showing it's recommended for first-time users */}
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800">
          First time
        </span>
      </button>
    </div>
  );
}
