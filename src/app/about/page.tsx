'use client';

import Link from 'next/link';
import { PartyPopper, Users, Calendar, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UserMenu } from '@/components/UserMenu';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-lg shadow-lg shadow-pink-500/10 text-slate-900">
              <PartyPopper size={24} />
            </div>
            <span className="text-xl font-bold text-white hidden md:block">Skiboh</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/events" className="hidden md:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Browse Events
            </Link>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600">Skiboh</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Connecting party lovers across Nigeria with the best events, concerts, and social gatherings.
          </p>
        </section>

        {/* Mission Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              Skiboh was born from a simple idea: making it easier for Nigerians to discover and attend amazing events. 
              Whether you&apos;re looking for a rooftop party in Lagos, a beach bash in Port Harcourt, or a music festival in Abuja, 
              we&apos;ve got you covered.
            </p>
            <p className="text-slate-300 text-lg leading-relaxed">
              We&apos;re building the #1 party platform for Nigeria, connecting event organizers with party enthusiasts 
              across all 36 states and the FCT. Our goal is to make every weekend unforgettable.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Skiboh?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Discover Events</h3>
              <p className="text-slate-400">
                Browse thousands of events happening across Nigeria. Filter by location, date, category, and more.
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Host Your Own</h3>
              <p className="text-slate-400">
                Create and manage your events with ease. Reach thousands of potential attendees across Nigeria.
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Verified Events</h3>
              <p className="text-slate-400">
                All events are verified to ensure authenticity and quality. Your safety is our priority.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-yellow-500/10 via-pink-500/10 to-orange-500/10 border border-yellow-500/20 rounded-3xl p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-slate-400 text-lg mb-8">
              Join thousands of party lovers and event organizers on Skiboh today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events">
                <Button variant="primary" className="w-full sm:w-auto">
                  Browse Events
                </Button>
              </Link>
              <Link href="/dashboard/event/new">
                <Button variant="secondary" className="w-full sm:w-auto">
                  Host an Event
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-lg flex items-center justify-center text-xl">
                  <PartyPopper size={20} />
                </div>
                <span className="text-lg sm:text-xl font-bold text-white">Skiboh</span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm">
                The #1 party platform for Nigeria.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Discover</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-slate-400 text-xs sm:text-sm">
                <li><Link href="/events" className="hover:text-white transition-colors">All Events</Link></li>
                <li><Link href="/events?category=nightlife" className="hover:text-white transition-colors">Nightlife</Link></li>
                <li><Link href="/events?category=music" className="hover:text-white transition-colors">Music</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Organize</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-slate-400 text-xs sm:text-sm">
                <li><Link href="/dashboard/event/new" className="hover:text-white transition-colors">Create Event</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">My Events</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Connect</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-slate-400 text-xs sm:text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-slate-400 text-xs sm:text-sm">
            <p>&copy; {new Date().getFullYear()} Skiboh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

