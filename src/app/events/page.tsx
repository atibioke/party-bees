'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  MapPin,
  Calendar,
  Filter,
  Music,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UserMenu } from '@/components/UserMenu';
import statesData from '@/utils/states.json';
import { format } from 'date-fns';

interface Event {
  id: string;
  _id?: string;
  slug?: string;
  title: string;
  startDateTime: Date;
  endDateTime: Date;
  location?: string;
  state: string;
  lga: string;
  address: string;
  host: string;
  image?: string;
  flyer?: string;
  price?: string;
  isPaid: boolean;
  attendees?: number;
  category?: string;
  description: string;
  labels: string[];
}

const CATEGORIES = ['All', 'Nightlife', 'Music', 'Luxury', 'Food & Drink', 'Networking'];

export default function EventsPage() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');
  const [selectedLGA, setSelectedLGA] = useState(searchParams.get('lga') || '');

  const availableLgas = useMemo(() => {
    const stateData = statesData.find(s => s.state === selectedState);
    return stateData ? stateData.lgas : [];
  }, [selectedState]);

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchEvents = useCallback(async (page: number, append: boolean = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    
    try {
      const params = new URLSearchParams();
      if (selectedState) params.append('state', selectedState);
      if (selectedLGA) params.append('lga', selectedLGA);
      params.append('page', page.toString());
      params.append('limit', '12');

      const res = await fetch(`/api/events?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        // Ensure dates are Date objects
          const now = new Date();
          const eventsData = data.data
            .map((event: {
              _id: string;
              id?: string;
              slug?: string;
              title: string;
              startDateTime: string;
              endDateTime: string;
              state: string;
              lga: string;
              address: string;
              host: string;
              flyer?: string;
              description: string;
              isPaid: boolean;
              price?: string;
              labels: string[];
            }) => ({
              ...event,
              id: event._id || event.id, // Map _id to id
              slug: event.slug,
              startDateTime: new Date(event.startDateTime),
              endDateTime: new Date(event.endDateTime),
            }))
            .filter((event: Event) => {
              // Filter out past events (events that have already ended)
              return event.endDateTime >= now;
            });
        
        if (append) {
          setEvents(prev => [...prev, ...eventsData]);
        } else {
          setEvents(eventsData);
        }
        
        if (data.pagination) {
          setHasMore(data.pagination.hasNextPage);
        }
      } else {
        console.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedState, selectedLGA]);

  // Initialize search term from URL params
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam !== null) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchEvents(1, false);
  }, [selectedState, selectedLGA, fetchEvents]);

  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchEvents(nextPage, true);
  }, [currentPage, fetchEvents]);

  // Filter events based on other criteria (search, date, price)
  const filteredEvents = events.filter(event => {
    // Search filtering
    let matchesSearch = true; // Default to true (show all if no search term)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      matchesSearch = 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        (typeof event.location === 'string' && event.location.toLowerCase().includes(searchLower)) ||
        (typeof event.state === 'string' && event.state.toLowerCase().includes(searchLower)) ||
        (typeof event.lga === 'string' && event.lga.toLowerCase().includes(searchLower)) ||
        (typeof event.address === 'string' && event.address.toLowerCase().includes(searchLower));
    }

    // Category filtering - assuming category is not yet in DB model but we can filter if it was there
    // For now, if category is missing in event, we might skip this filter or assume 'All'
    const matchesCategory = selectedCategory === 'All' || (event.category && event.category === selectedCategory);

    const matchesPrice = priceFilter === 'all' ||
      (priceFilter === 'free' && !event.isPaid) ||
      (priceFilter === 'paid' && event.isPaid);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-pink-500 selection:text-white">

      {/* Header / Nav */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-lg shadow-lg shadow-pink-500/10 text-slate-900">
                
              </div>
              <span className="text-xl font-bold text-white hidden md:block">Skiboh</span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events, cities, vibes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard/event/new" className="hidden md:block">
              <Button className="py-2.5 px-6 text-sm shadow-pink-500/20">Host a Party</Button>
            </Link>
            <UserMenu />
          </div>
        </div>

        {/* Mobile Search Bar (visible only on small screens) */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-full py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 transition-all"
            />
          </div>
        </div>
      </header>

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Title & Mobile Filters Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">Explore Events </h1>
            <p className="text-slate-400">Discover the hottest parties and gatherings happening around you.</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center justify-center gap-2 w-full py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-white"
          >
            <Filter size={16} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">

          {/* Sidebar Filters - Fixed on desktop */}
          <aside className={`lg:w-64 lg:sticky lg:top-24 flex-shrink-0 space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Categories */}
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Categories</h3>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat
                      ? 'bg-white text-slate-900 shadow-md'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

                 {/* Location Filter */}
                 <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Location</h3>
              <div className="space-y-3">
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedLGA('');
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500/50 transition-colors appearance-none"
                >
                  <option value="">All States</option>
                  {statesData.map((s) => (
                    <option key={s.alias} value={s.state}>
                      {s.state}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedLGA}
                  onChange={(e) => setSelectedLGA(e.target.value)}
                  disabled={!selectedState}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500/50 transition-colors appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">All Cities / LGAs</option>
                  {availableLgas.map((lga) => (
                    <option key={lga} value={lga}>
                      {lga}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Price</h3>
              <div className="bg-slate-900 rounded-xl p-1 border border-slate-800 flex">
                <button
                  onClick={() => setPriceFilter('all')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${priceFilter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setPriceFilter('free')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${priceFilter === 'free' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Free
                </button>
                <button
                  onClick={() => setPriceFilter('paid')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${priceFilter === 'paid' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Paid
                </button>
              </div>
            </div>

       
          </aside>

          {/* Events Grid - Scrollable on desktop */}
          <div className="flex-1 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto lg:pr-2 scrollbar-thin">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-slate-800"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                      <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredEvents.map((event) => {
                    // Generate slug from title if missing (for backward compatibility)
                    const slug = event.slug || event.title
                      .toLowerCase()
                      .trim()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/[\s_-]+/g, '-')
                      .replace(/^-+|-+$/g, '');
                    
                    return (
                  <Link href={`/events/${slug}`} key={event.id} className="group block">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden hover:border-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 transform hover:-translate-y-1 h-full flex flex-col">

                      {/* Image */}
                      <div className="h-48 relative overflow-hidden">
                        <Image
                          src={event.flyer || event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80"}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {event.category && (
                          <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-slate-800">
                            {event.category}
                          </div>
                        )}
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${event.isPaid ? 'bg-pink-600' : 'bg-green-600'}`}>
                          {event.isPaid ? (event.price ? `₦${event.price}` : 'Paid') : 'Free'}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-pink-500 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Calendar size={12} /> {event.startDateTime ? format(event.startDateTime, 'MMM dd, yyyy • h:mm a') : 'TBA'}
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-500 transition-colors line-clamp-2">{event.title}</h3>

                        <div className="space-y-2 mb-6 flex-1">
                          <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <MapPin size={14} className="text-yellow-500" />
                            {event.location || `${event.lga}, ${event.state}`}
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Music size={14} className="text-blue-400" />
                            Hosted by <span className="text-white font-medium">{event.host}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-auto">
                          {event.labels && event.labels.map(label => (
                            <span key={label} className="px-2 py-1 bg-slate-800 rounded-md text-[10px] text-slate-300 font-medium border border-slate-700">
                              #{label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                    );
                  })}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-xl text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 transform hover:scale-105 active:scale-95"
                    >
                      {loadingMore ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <Loader2 size={16} />
                        </span>
                      ) : (
                        'Load More Events'
                      )}
                    </button>
                  </div>
                )}
                
                {!hasMore && events.length > 0 && (
                  <div className="mt-8 text-center">
                    <p className="text-slate-400 text-sm">
                      You&apos;ve reached the end! 🎉
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-12 text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-slate-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
                <p className="text-slate-400 max-w-md mx-auto">We couldn&apos;t find any parties matching your criteria. Try adjusting your filters or search term.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setPriceFilter('all');
                    setSelectedState('');
                    setSelectedLGA('');
                    setCurrentPage(1);
                  }}
                  className="mt-6 text-pink-500 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
