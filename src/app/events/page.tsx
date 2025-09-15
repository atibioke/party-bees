'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const events = [
  {
    id: 1,
    title: 'AfroBeats Night',
    date: 'Sept 20, 2025',
    location: 'Lagos, Nigeria',
    host: 'DJ Spinall',
    flyer: `https://picsum.photos/400/250?random=${10}`,
  },
  {
    id: 2,
    title: 'Beach House Party',
    date: 'Sept 28, 2025',
    location: 'Accra, Ghana',
    host: 'Party Bees',
    flyer:  `https://picsum.photos/400/250?random=${11}`,
  },
  {
    id: 3,
    title: 'Neon Glow Rave',
    date: 'Oct 5, 2025',
    location: 'Nairobi, Kenya',
    host: 'Club XYZ',
    flyer:  `https://picsum.photos/400/250?random=${12}`,
  },
];

export default function EventsPage() {
  return (
      <main className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-white py-16 px-6">
     <div className="absolute top-4 left-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 text-slate-700 font-medium shadow hover:bg-white hover:shadow-md transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-700 mb-10 text-center">Upcoming Events</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => (
            <div
              key={event.id}
              className="bg-white/90 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <img src={event.flyer} alt={event.title} className="w-full h-48 object-cover" />
              <div className="p-5 space-y-2">
                <h2 className="text-lg font-semibold text-slate-800">{event.title}</h2>
                <p className="text-sm text-slate-600">{event.date}</p>
                <p className="text-sm text-slate-600">{event.location}</p>
                <p className="text-sm text-slate-500">Hosted by {event.host}</p>

                <Link
                  href={`/events/${event.id}`}
                  className="mt-3 inline-block w-full text-center py-2.5 rounded-xl text-white font-semibold bg-gradient-to-r from-yellow-400 to-pink-500 shadow hover:shadow-lg transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
