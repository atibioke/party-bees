'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Users, Mail, Phone, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';

interface Attendee {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
}

export default function ViewAttendeesPage() {
  const params = useParams();
  const id = params.id as string;
  const { showToast } = useToast();

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventTitle, setEventTitle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event details
        const eventRes = await fetch(`/api/events/${id}`);
        const eventData = await eventRes.json();
        
        if (eventData.success) {
          setEventTitle(eventData.data.title);
        }

        // Fetch attendees
        const attendeesRes = await fetch(`/api/events/${id}/attendees`);
        const attendeesData = await attendeesRes.json();

        if (attendeesData.success) {
          setAttendees(attendeesData.data);
        } else {
          showToast(attendeesData.error || 'Failed to load attendees', 'error');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('An unexpected error occurred', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, showToast]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <Link 
          href={`/dashboard/event/${id}/edit`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={18} /> Back to Edit Event
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Event Attendees</h1>
            <p className="text-slate-400 text-sm md:text-base">
              {eventTitle && <span className="text-white font-bold">{eventTitle}</span>}
              {!eventTitle && 'Viewing attendees'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Users size={18} />
            <span className="font-bold text-white">{attendees.length}</span>
            <span>Registered</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#131722] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Loading attendees...</p>
          </div>
        ) : attendees.length > 0 ? (
          <div className="divide-y divide-slate-800/50">
            {attendees.map((attendee) => (
              <div key={attendee._id} className="p-6 hover:bg-slate-900/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{attendee.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Phone size={16} />
                        <span className="text-sm">{attendee.phone}</span>
                      </div>
                      {attendee.email && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Mail size={16} />
                          <span className="text-sm">{attendee.email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Calendar size={14} />
                        <span>Registered {new Date(attendee.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No attendees yet</h3>
            <p className="text-slate-400 mb-6">No one has registered for this event yet.</p>
            <Link href={`/events/${id}`}>
              <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                View Event Page
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

