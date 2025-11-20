'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Music,
  ShieldCheck,
  Zap,
  ChevronRight,
  PartyPopper
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UserMenu } from '@/components/UserMenu';


// Event type for trending events
interface TrendingEvent {
  id: string;
  _id?: string;
  slug?: string;
  title: string;
  startDateTime: string | Date;
  endDateTime: string | Date;
  state: string;
  lga: string;
  address: string;
  host: string;
  flyer?: string;
  isPaid: boolean;
  price?: string;
  labels: string[];
}

const categories = [
  { name: 'House Parties', icon: '🏠', count: '450+' },
  { name: 'Club Nights', icon: '🪩', count: '120+' },

  { name: 'Rooftop', icon: '🌆', count: '60+' },
];

export default function LandingPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [trendingEvents, setTrendingEvents] = useState<TrendingEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch featured/trending events
  useEffect(() => {
    const fetchTrendingEvents = async () => {
      try {
        setLoadingEvents(true);
        const res = await fetch('/api/events/featured');
        const data = await res.json();
        if (data.success && data.data) {
          setTrendingEvents(data.data);
        }
      } catch (error) {
        console.error('Error fetching trending events:', error);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchTrendingEvents();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/events?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/events');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden">

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent ${isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-slate-800 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-pink-500/20">
            <PartyPopper size={24} />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 cursor-pointer">
              Skiboh
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <UserMenu />
            <Link href="/events" className="inline-flex items-center justify-center py-3 px-6 rounded-lg font-semibold shadow transition-all duration-200 bg-transparent border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-sm ">Find Events</Link>
          </div>

          {/* Mobile Menu - Use UserMenu which handles mobile menu internally */}
          <div className="md:hidden">
            <UserMenu />
          </div>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-600/20 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl mix-blend-screen"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div style={{ transform: 'rotate(-4deg)'}} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-pink-400 text-xs font-bold uppercase tracking-wider shadow-sm animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
               </span>
              The #1 Party Platform
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.1]">
              Party Hard <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600">
                Create Memories!
              </span>
            </h1>

            {/* Large Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-pink-500/20 to-orange-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-1.5 sm:p-2 flex items-center gap-1.5 sm:gap-2 shadow-2xl">
                <Search className="w-4 h-4 sm:w-6 sm:h-6 text-slate-400 ml-2 sm:ml-4 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search events, locations, vibes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm sm:text-lg py-2 sm:py-3 focus:outline-none min-w-0"
                />
                <Button type="submit" variant="primary" className="px-3 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg font-bold whitespace-nowrap flex-shrink-0 !border-none">
                  Search
                </Button>
              </div>
            </form>

            <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
              Discover the hottest parties, concerts, and events happening across Nigeria. 
              From rooftop vibes to beach bashes, find your perfect night out in any city.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span>Verified Events</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Instant RSVP</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-400" />
                <span>Join the Community</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Events Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1.5 sm:mb-2">Trending Now</h2>
              <p className="text-slate-400 text-sm sm:text-base">The hottest events happening this week across Nigeria</p>
            </div>
            <Link href="/events">
              <Button variant="secondary" className="hidden md:flex items-center gap-2">
                View All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loadingEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-800"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                    <div className="h-6 bg-slate-800 rounded"></div>
                    <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : trendingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingEvents.map((event) => {
                const startDate = new Date(event.startDateTime);
                const formattedDate = startDate.toLocaleDateString('en-NG', {
                  month: 'short',
                  day: 'numeric',
                });
                const formattedTime = startDate.toLocaleTimeString('en-NG', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                });
                const category = event.labels && event.labels.length > 0 ? event.labels[0] : 'Event';
                const location = `${event.lga}, ${event.state}`;
                const priceDisplay = event.isPaid ? (event.price || 'Paid') : 'Free';
                const eventSlug = event.slug || event.id;

                return (
                  <Link
                    key={event.id}
                    href={`/events/${eventSlug}`}
                    className="group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden hover:border-pink-500/50 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {event.flyer ? (
                        <Image
                          src={event.flyer}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-yellow-500/20 flex items-center justify-center">
                          <Music className="w-16 h-16 text-slate-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                      <div className="absolute top-4 right-4 px-3 py-1 bg-slate-900/80 backdrop-blur-sm rounded-full text-xs font-bold text-white">
                        {priceDisplay}
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                          {category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formattedDate}, {formattedTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{location}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400">No upcoming events at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1.5 sm:mb-2">Explore by Category</h2>
            <p className="text-slate-400 text-sm sm:text-base">Find events that match your vibe</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/events?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 text-center"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-slate-400 text-sm">{category.count} Events</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-yellow-500/10 via-pink-500/10 to-orange-500/10 rounded-3xl p-6 sm:p-8 lg:p-12 border border-slate-800">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
              Ready to Host Your Own Event?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed">
              Join thousands of event organizers across Nigeria and create unforgettable experiences.
            </p>
            <Link href="/dashboard/event/new">
              <Button variant="primary" className="text-lg px-8 py-4">
                Create Your Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
