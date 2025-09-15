'use client';

import React, { useRef, useState } from 'react';
import AuthActions from '@/components/AuthActions';
import Link from 'next/link';

/**
 * Party Bees — Captivating landing page (Tailwind)
 * Put this file at: src/app/page.tsx
 *
 * Notes:
 * - Replace sample images with your own assets or unsplash links.
 * - Tailwind must be installed and configured.
 */

const sampleParties = [
  {
    id: '1',
    title: 'Sunset Rooftop Bash',
    city: 'Lagos',
    date: 'Sat, Oct 4 • 9PM',
    image: `https://picsum.photos/400/250?random=${1}`,
    attendees: 128,
  },
  {
    id: '2',
    title: 'Neon House Party',
    city: 'Accra',
    date: 'Fri, Oct 10 • 11PM',
    image: `https://picsum.photos/400/250?random=${2}`,
    attendees: 92,
  },
  {
    id: '3',
    title: 'Beach Bonfire & Beats',
    city: 'Cape Town',
    date: 'Sun, Oct 12 • 6PM',
    image: `https://picsum.photos/400/250?random=${3}`,
    attendees: 210,
  },
  {
    id: '4',
    title: 'Underground Vinyl Night',
    city: 'London',
    date: 'Sat, Oct 18 • 10PM',
    image: `https://picsum.photos/400/250?random=${4}`,
    attendees: 64,
  },
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'browse' | 'host'>('browse');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const distance = 320;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fffaf0] via-white to-[#fffbeb] text-slate-800">
      {/* NAV */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-pink-500 flex items-center justify-center text-white font-bold shadow">
            🐝
          </div>
          <span className="font-extrabold text-lg">Party Bees</span>
        </div>
        

        <nav className="flex items-center gap-4">
          <Link href="/events" className="text-sm font-medium hover:text-yellow-600">Events</Link>
          <Link href="/about" className="text-sm font-medium hover:text-yellow-600">About</Link>
          <Link href="/hostevent" className="hidden sm:inline-block px-4 py-2 rounded-lg bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition">
            Host a Party
          </Link>
            <Link href="/user-profile" className="text-sm font-medium hover:text-yellow-600">Profile</Link>
               <Link href="/admin" className="text-sm font-medium hover:text-yellow-600">Admin</Link>
          <Link href="/login" className="text-sm" >Log in</Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-12">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Find the best parties. Meet the right people. Make memories.
          </h1>
          <p className="text-lg text-slate-600 max-w-xl">
            Party Bees helps you discover curated local events, RSVP safely, and connect with hosts and guests — all in one place.
          </p>

          {/* Search & quick action */}
          <div className="flex gap-3 items-center">
            <div className="flex bg-white rounded-full shadow-sm p-1 items-center overflow-hidden">
              <input
                aria-label="Search parties"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search parties, city or tag (e.g., rooftop, beach)"
                className="px-4 py-3 w-64 sm:w-96 outline-none text-sm"
              />
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full ml-1 font-semibold transition" onClick={() => { /* implement search */ }}>
                Search
              </button>
            </div>

            {/* <div className="flex items-center gap-2">
              <button
                onClick={() => setTab('browse')}
                className={`px-3 py-2 rounded-full text-sm ${tab==='browse' ? 'bg-yellow-100 text-yellow-700' : 'bg-transparent hover:bg-yellow-50'}`}
              >
                Browse
              </button>
              <button
                onClick={() => setTab('host')}
                className={`px-3 py-2 rounded-full text-sm ${tab==='host' ? 'bg-yellow-100 text-yellow-700' : 'bg-transparent hover:bg-yellow-50'}`}
              >
                Host
              </button>
            </div> */}
          </div>
               


          {/* Trust & quick stats */}
          <div className="flex gap-6 mt-2">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white p-2 shadow text-sm font-semibold">🌍</div>
              <div className="text-sm">
                <div className="font-medium">300k+</div>
                <div className="text-xs text-slate-500">Events posted</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white p-2 shadow text-sm font-semibold">🔒</div>
              <div className="text-sm">
                <div className="font-medium">Verified hosts</div>
                <div className="text-xs text-slate-500">Safety-first community</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero visual + CTA */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <div className="aspect-[16/10] sm:aspect-[4/3] bg-gradient-to-br from-pink-50 to-yellow-50">
            <img src={`https://picsum.photos/400/250?random=${6}`} alt="party" className="w-full h-full object-cover opacity-90" />
          </div>

          <div className="absolute left-6 bottom-6 right-6 flex items-center justify-between gap-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow">
              <div className="text-sm text-slate-600">Next big party</div>
              <div className="font-bold">Sunset Rooftop Bash</div>
              <div className="text-xs text-slate-500">Lagos • Sat, Oct 4</div>
            </div>
            <Link href="/events/create" className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold shadow">
              Create event
            </Link>
          </div>
        </div>
      </section>
   

      {/* Horizontal carousel (Trending) */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">🔥 Trending near you</h2>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} aria-label="Scroll left" className="p-2 rounded-lg bg-white shadow hover:bg-slate-50">◀</button>
            <button onClick={() => scroll('right')} aria-label="Scroll right" className="p-2 rounded-lg bg-white shadow hover:bg-slate-50">▶</button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory px-1 pb-1"
        >
          {sampleParties.map((p) => (
            <article key={p.id} className="snap-start min-w-[280px] max-w-[320px] bg-white rounded-2xl shadow hover:shadow-2xl transition transform hover:-translate-y-1">
              <div className="h-[180px] rounded-t-2xl overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{p.title}</h3>
                <p className="text-sm text-slate-500">{p.city} • {p.date}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-slate-600">{p.attendees} going</div>
                  <div className="flex gap-2">
                    <a href={`/events/${p.id}`} className="text-yellow-600 text-sm font-semibold hover:underline">View</a>
                    <button className="px-3 py-1 rounded-lg bg-yellow-500 text-white text-sm font-medium shadow">RSVP</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Features / Benefits */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white shadow text-center">
            <div className="text-4xl">🔎</div>
            <h4 className="font-bold mt-4">Curated events</h4>
            <p className="text-sm text-slate-500 mt-2">We surface high-quality events based on your vibe and city.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white shadow text-center">
            <div className="text-4xl">🛡️</div>
            <h4 className="font-bold mt-4">Safety-first</h4>
            <p className="text-sm text-slate-500 mt-2">Verified hosts, community reports, and in-app emergency support.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white shadow text-center">
            <div className="text-4xl">🤝</div>
            <h4 className="font-bold mt-4">Connect & chat</h4>
            <p className="text-sm text-slate-500 mt-2">Message hosts or other attendees to coordinate plans privately.</p>
          </div>
        </div>
      </section>

      {/* Safety & Moderation highlight */}
      <section className="max-w-7xl mx-auto px-6 py-8 bg-yellow-50 rounded-2xl my-6">
        <div className="md:flex md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Your safety matters</h3>
            <p className="text-slate-600 mt-2 max-w-xl">
              We combine host verification, community ratings, and manual moderation. Hosts can be verified with ID and social checks, and every event has a safety contact and a quick-report button.
            </p>
            <div className="mt-4 flex gap-3">
              <div className="bg-white rounded-full px-3 py-2 shadow text-sm">Host verification</div>
              <div className="bg-white rounded-full px-3 py-2 shadow text-sm">Community reports</div>
              <div className="bg-white rounded-full px-3 py-2 shadow text-sm">Emergency support</div>
            </div>
          </div>

          <div className="mt-6 md:mt-0">
            <img src="https://images.unsplash.com/photo-1518600506278-4e8ef466b810?w=800&q=80&auto=format&fit=crop" alt="safety" className="w-[260px] rounded-xl shadow" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-2xl font-bold text-center mb-8">What our users say</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <blockquote className="p-6 bg-white rounded-2xl shadow">
            <p className="text-slate-700">“I found my favorite crew through Party Bees. Events are always well-moderated and fun.”</p>
            <footer className="mt-4 text-sm text-slate-500">— Aisha, Lagos</footer>
          </blockquote>
          <blockquote className="p-6 bg-white rounded-2xl shadow">
            <p className="text-slate-700">“Easy to host and manage RSVPs — I posted a flyer and had 120 confirmed within 2 days.”</p>
            <footer className="mt-4 text-sm text-slate-500">— Miguel, Cape Town</footer>
          </blockquote>
          <blockquote className="p-6 bg-white rounded-2xl shadow">
            <p className="text-slate-700">“The chat feature made planning simple. The safety features give me confidence to attend.”</p>
            <footer className="mt-4 text-sm text-slate-500">— Rosa, Madrid</footer>
          </blockquote>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6 bg-gradient-to-r from-yellow-500 to-pink-400 rounded-2xl text-white p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-xl">Ready to join the buzz?</h4>
            <p className="text-sm opacity-90">Sign up for free and discover parties near you — or host your own.</p>
          </div>
          <div className="flex gap-3">
            <a href="/signup" className="px-5 py-2 bg-white text-yellow-600 rounded-full font-semibold shadow">Get Started</a>
            <a href="/events" className="px-5 py-2 border border-white/60 rounded-full">Browse events</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-6 md:flex md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Party Bees</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="/terms" className="hover:underline">Terms</a>
            <a href="/privacy" className="hover:underline">Privacy</a>
            <a href="/help" className="hover:underline">Help</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
