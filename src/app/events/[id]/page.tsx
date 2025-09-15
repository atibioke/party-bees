'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  CalendarDays,
  MapPin,
  User,
  Share2,
  Check,
  ArrowLeft,
  Users,
  Star,
} from 'lucide-react';

type Attendee = { name: string; avatarUrl?: string };

type Event = {
  id: number;
  title: string;
  date: string;
  isoDate?: string;
  time?: string;
  location: string;
  host: string;
  flyer: string;
  description: string;
  tags?: string[];
  attendees?: Attendee[];
  rating?: number;
};

const mockEvents: Record<number, Event> = {
  1: {
    id: 1,
    title: 'AfroBeats Night — Sunset Sessions',
    date: 'Sat • Sept 20, 2025',
    isoDate: '2025-09-20',
    time: '19:00 – 02:00',
    location: 'Lagos, NG • The Warehouse',
    host: 'DJ Spinall',
    flyer: `https://picsum.photos/1600/1000?random=${10}`,
    description:
      "A high-energy AfroBeats night with top DJs, live percussion and surprise guests. Expect amazing vibes, immersive visuals and a dancefloor that never sleeps. Everyone’s welcome — dress to impress and bring your best energy!",
    tags: ['AfroBeats', 'Dance', 'Nightlife'],
    attendees: [
      { name: 'Aisha', avatarUrl: 'https://i.pravatar.cc/40?img=5' },
      { name: 'Tunde', avatarUrl: 'https://i.pravatar.cc/40?img=12' },
      { name: 'Maya', avatarUrl: 'https://i.pravatar.cc/40?img=22' },
      { name: 'Kofi', avatarUrl: 'https://i.pravatar.cc/40?img=18' },
      { name: 'Lina', avatarUrl: 'https://i.pravatar.cc/40?img=15' },
      { name: 'Zara', avatarUrl: 'https://i.pravatar.cc/40?img=30' },
    ],
    rating: 4.7,
  },
};

export default function EventDetailsPage() {
  const params = useParams() as { id?: string };
  const id = Number(params?.id ?? NaN);
  const event = mockEvents[id];

  const [isCopySuccess, setIsCopySuccess] = useState(false);

  useEffect(() => {
    setIsCopySuccess(false);
  }, [id]);

  const previewAttendees = useMemo(() => event?.attendees?.slice(0, 5) ?? [], [event]);
  const remainingCount = useMemo(
    () => (event?.attendees && event.attendees.length > 5 ? event.attendees.length - 5 : 0),
    [event]
  );

  const copyLink = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    await navigator.clipboard.writeText(url);
    setIsCopySuccess(true);
    setTimeout(() => setIsCopySuccess(false), 1800);
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-xl">
          <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
          <Link href="/events" className="mt-4 inline-block text-yellow-600 hover:underline text-lg">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Back link */}
      
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 text-slate-700 font-medium shadow hover:bg-white hover:shadow-md transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Events
          </Link>
      

        {/* Event Card */}
        <div className="grid p-4 md:grid-cols-2 gap-8 bg-white shadow-2xl rounded-3xl overflow-hidden">
          {/* Flyer */}
          <div className="relative">
            <img
              src={event.flyer}
              alt={event.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Details */}
          <div className="p-10 flex flex-col justify-between gap-8 text-gray-900">
            <div className="space-y-6">
              {/* Title + Rating */}
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-extrabold text-slate-700">{event.title}</h1>
                {event.rating && (
                  <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-lg font-semibold">
                    <Star className="w-6 h-6" />
                    {event.rating.toFixed(1)}
                  </div>
                )}
              </div>

              {/* Tags */}
              {event.tags && (
                <div className="flex flex-wrap gap-3">
                  {event.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 rounded-full text-sm bg-yellow-200 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Meta Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-6 h-6 text-slate-700" />
                  <div>
                    <div className="text-sm text-slate-700">Date & Time</div>
                    <div className="text-lg font-semibold text-slate-700">{event.date} · {event.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-slate-700" />
                  <div>
                    <div className="text-sm text-slate-700">Location</div>
                    <div className="text-lg font-semibold text-slate-700">{event.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-blue-500 text-slate-700" />
                  <div>
                    <div className="text-sm text-slate-700">Host</div>
                    <div className="text-lg font-semibold text-slate-700">{event.host}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-semibold text-slate-700">About the event</h2>
                <p className="mt-4 leading-relaxed text-slate-700">{event.description}</p>
              </div>
            </div>

            {/* Attendees + Actions */}
            <div className="flex flex-col gap-6">
              {event.attendees && event.attendees.length > 0 && (
                <div className="flex items-center gap-4">
                  <Users className="w-6 h-6 text-slate-700" />
                  <div className="flex -space-x-3">
                    {previewAttendees.map((att, idx) => (
                      <img
                        key={idx}
                        src={att.avatarUrl}
                        alt={att.name}
                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                    {remainingCount > 0 && (
                      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-xs text-gray-700 border-2 border-white">
                        +{remainingCount}
                      </span>
                    )}
                  </div>
                  <span className="text-lg font-medium">
                    {event.attendees?.length ?? 0} going
                  </span>
                </div>
              )}

              {/* Action buttons */}
       <div className="flex flex-wrap items-center gap-4">
  <button className="flex-1 py-5 px-6 rounded-xl font-semibold text-lg text-white bg-gradient-to-r from-yellow-400 to-pink-500 hover:scale-105 transition transform shadow-md">
    Attend
  </button>
  <button
    onClick={copyLink}
    className="flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-gray-900"
  >
    <Share2 className="w-5 h-5" />
    {isCopySuccess ? <Check className="w-5 h-5 text-green-500" /> : 'Share'}
  </button>
</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
