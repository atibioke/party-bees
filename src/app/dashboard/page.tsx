'use client';

import { useState, useEffect } from "react";
import { User, Calendar, Clock, MapPin, CheckCircle, MoreVertical, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"profile" | "upcoming" | "past">("upcoming");
  const [profile, setProfile] = useState<{ businessName?: string; email?: string; whatsapp?: string } | null>(null);
  const [events, setEvents] = useState<Array<{
    _id: string;
    id?: string;
    title: string;
    startDateTime: string;
    endDateTime: string;
    state: string;
    lga: string;
    address: string;
    flyer?: string;
    image?: string;
    isPaid: boolean;
    price?: string;
    labels?: string[];
    location?: string;
    attendees?: number;
    date?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const userRes = await fetch('/api/auth/me');
        const userData = await userRes.json();

        if (userData.success) {
          setProfile(userData.data);

          // Fetch user's events
          const eventsRes = await fetch(`/api/events?hostId=${userData.data._id}`);
          const eventsData = await eventsRes.json();

          if (eventsData.success) {
            setEvents(eventsData.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading dashboard...</div>;
  }

  const upcomingEvents = events.filter(e => new Date(e.startDateTime) > new Date());
  const pastEvents = events.filter(e => new Date(e.startDateTime) <= new Date());

  return (
    <>
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {activeTab === "upcoming" && "Your Events"}
            {activeTab === "past" && "Event History"}
            {activeTab === "profile" && "Account Settings"}
          </h1>
          <p className="text-slate-400">
            {activeTab === "upcoming" && "Manage and track your upcoming parties."}
            {activeTab === "past" && "Review details from your previous events."}
            {activeTab === "profile" && "Update your personal information and bio."}
          </p>
        </div>

        {activeTab !== "profile" && (
          <Link href="/dashboard/event/new">
            <button className="flex items-center gap-2 bg-white text-slate-900 px-5 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-lg shadow-pink-500/5 group">
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              Create Event
            </button>
          </Link>
        )}
      </div>

      {/* Tabs Navigation (Visible only on mobile/tablet inside content area if needed, but we have sidebar now) */}
      {/* For simplicity, let's keep a sub-nav for switching views within the dashboard page itself */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 md:hidden">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === "upcoming" ? "bg-pink-600 text-white" : "bg-slate-800 text-slate-400"}`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === "past" ? "bg-pink-600 text-white" : "bg-slate-800 text-slate-400"}`}
        >
          Past Events
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === "profile" ? "bg-pink-600 text-white" : "bg-slate-800 text-slate-400"}`}
        >
          Profile
        </button>
      </div>

      {/* Tab Content: Upcoming */}
      {activeTab === "upcoming" && (
        <div className="space-y-6">
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {upcomingEvents.map((event) => (
                <div key={event._id || event.id} className="bg-[#131722] border border-slate-800/60 rounded-2xl p-4 flex flex-col md:flex-row gap-6 hover:border-slate-700 transition-all group">
                  <div className="w-full md:w-64 h-48 md:h-40 relative rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={event.flyer || event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80"}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                      {event.isPaid ? (event.price ? `₦${event.price}` : 'Paid') : 'Free'}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">{event.title}</h3>
                        <button className="text-slate-500 hover:text-white p-1">
                          <MoreVertical size={20} />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-slate-500" /> {event.startDateTime ? new Date(event.startDateTime).toLocaleDateString() : 'TBA'}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-slate-500" /> {event.startDateTime ? new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBA'}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-slate-500" /> {event.location || `${event.lga}, ${event.state}`}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {event.labels && event.labels.map((l: string) => (
                          <span key={l} className="text-xs px-2 py-1 bg-slate-800/50 text-slate-400 rounded-md">{l}</span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/50">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-bold text-white">{event.attendees || 0}</span>
                        <span className="text-slate-500">Confirmed Guests</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">View Details</button>
                        <Link href={`/dashboard/event/${event._id || event.id}/edit`}>
                          <button className="px-4 py-2 text-sm font-medium bg-white text-slate-900 rounded-lg hover:bg-slate-200 transition-colors">Edit Event</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#131722] rounded-2xl border border-slate-800/50 border-dashed">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                <Calendar size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No upcoming events</h3>
              <p className="text-slate-500 mb-6">You haven&apos;t scheduled any parties yet.</p>
              <Link href="/dashboard/event/new">
                <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                  Create First Event
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Past */}
      {activeTab === "past" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pastEvents.map(event => (
            <div key={event.id} className="bg-[#131722] border border-slate-800/60 rounded-2xl p-4 flex gap-4 hover:border-slate-700 transition-all opacity-75 hover:opacity-100">
              <div className="w-24 h-24 relative rounded-lg overflow-hidden shrink-0 bg-slate-800">
                <Image src={event.image || event.flyer || '/placeholder-event.jpg'} alt={event.title} fill className="object-cover grayscale hover:grayscale-0 transition-all" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white truncate mb-1">{event.title}</h4>
                <p className="text-sm text-slate-500 mb-2">{event.date}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle size={12} className="text-green-500" />
                  <span>Completed • {event.attendees} Guests</span>
                </div>
                <button className="text-xs font-medium text-pink-500 hover:text-pink-400 mt-3">View Summary</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Profile */}
      {activeTab === "profile" && (
        <div className="bg-[#131722] border border-slate-800/60 rounded-2xl p-8 max-w-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-slate-800/50">
              <div className="w-24 h-24 rounded-full bg-slate-800 relative overflow-hidden border-2 border-slate-700 group">
                <div className="w-full h-full flex items-center justify-center text-slate-500"><User size={32} /></div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Profile Details</h3>
                <p className="text-sm text-slate-500 mb-3">Manage your business information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Business Name</label>
                <input
                  type="text"
                  value={profile?.businessName || ''}
                  readOnly
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-500/50 opacity-70 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Email</label>
                <input
                  type="text"
                  value={profile?.email || ''}
                  readOnly
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-500/50 opacity-70 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">WhatsApp</label>
              <input
                type="text"
                value={profile?.whatsapp || ''}
                readOnly
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-500/50 opacity-70 cursor-not-allowed"
              />
            </div>

            <div className="pt-4">
              <p className="text-xs text-slate-500">To update your profile details, please contact support.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
