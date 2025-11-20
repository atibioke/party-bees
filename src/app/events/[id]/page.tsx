'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CalendarDays,
  MapPin,
  User,
  Share2,
  ArrowLeft,
  Star,
  Eye,
  Lock,
  Phone,
  MessageCircle,
  PartyPopper
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UserMenu } from '@/components/UserMenu';

type Attendee = { name: string; avatarUrl?: string };

type Event = {
  id: string;
  title: string;
  date: string;
  isoDate?: string;
  time?: string;
  location: string;
  address?: string;
  state?: string;
  lga?: string;
  host: string;
  organizerPhone?: string;
  organizerEmail?: string;
  flyer: string;
  description: string;
  tags?: string[];
  attendees?: Attendee[];
  rating?: number;
  isPaid: boolean;
  price?: string;
};


export default function EventDetailsPage() {
  const params = useParams() as { id?: string };
  const slug = params?.id;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // Blur state for free events
  const [isBlurred, setIsBlurred] = useState(true);
  // Contact details revealed state for paid events
  const [contactRevealed, setContactRevealed] = useState(false);

  const [isCopySuccess, setIsCopySuccess] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/events/${slug}`);
        const data = await res.json();
        
        if (!res.ok || !data.success) {
          console.error('Failed to fetch event:', data.error);
          setLoading(false);
          return;
        }
        
        if (data.data) {
          const eventData = data.data;
          const startDate = new Date(eventData.startDateTime);
          const endDate = new Date(eventData.endDateTime);
          
          const formattedEvent: Event = {
            id: String(eventData._id || eventData.id || ''),
            title: eventData.title,
            date: `${startDate.toLocaleDateString('en-US', { weekday: 'short' })} • ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
            isoDate: startDate.toISOString().split('T')[0],
            time: `${startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} – ${endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
            location: `${eventData.address}, ${eventData.lga}, ${eventData.state}`,
            address: eventData.address,
            state: eventData.state,
            lga: eventData.lga,
            host: eventData.host,
            organizerPhone: eventData.organizerPhone,
            organizerEmail: eventData.organizerEmail,
            flyer: eventData.flyer || eventData.image || 'https://picsum.photos/1600/1000',
            description: eventData.description,
            tags: eventData.labels || [],
            attendees: [],
            rating: undefined,
            isPaid: eventData.isPaid,
            price: eventData.price,
          };
          
          setEvent(formattedEvent);
          
          // If it's paid, we don't blur but contact details are hidden initially
          if (formattedEvent.isPaid) {
            setIsBlurred(false);
            setContactRevealed(false);
          } else {
            setIsBlurred(true);
            setContactRevealed(false);
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);


  const copyLink = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    await navigator.clipboard.writeText(url);
    setIsCopySuccess(true);
    setTimeout(() => setIsCopySuccess(false), 1800);
  };

  const handleRevealDetails = () => {
    setIsBlurred(false);
    setContactRevealed(true);
  };

  const handleGetTickets = () => {
    setContactRevealed(true);
  };

  // Generate WhatsApp link
  const getWhatsAppLink = (phone: string) => {
    // Remove any non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    // If it doesn't start with +, assume it's a Nigerian number and add country code
    const whatsappNumber = cleanPhone.startsWith('+') ? cleanPhone : `+234${cleanPhone.replace(/^0/, '')}`;
    return `https://wa.me/${whatsappNumber.replace(/\+/g, '')}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white font-sans">
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading event...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-950 text-white font-sans">
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 shadow-lg rounded-2xl p-8 text-center max-w-xl">
            <h2 className="text-2xl font-bold text-white">Event not found</h2>
            <Link href="/events" className="mt-4 inline-block text-pink-500 hover:underline text-lg">
              ← Back to Events
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Generate structured data for SEO
  const structuredData = event ? (() => {
    const startDate = event.isoDate ? new Date(event.isoDate) : new Date();
    const startTime = event.time?.split('–')[0]?.trim() || '18:00';
    const [startHours, startMinutes] = startTime.split(':');
    if (startHours && startMinutes) {
      startDate.setHours(parseInt(startHours), parseInt(startMinutes), 0);
    }
    
    const endDate = event.isoDate ? new Date(event.isoDate) : new Date();
    const endTime = event.time?.split('–')[1]?.trim() || '22:00';
    const [endHours, endMinutes] = endTime.split(':');
    if (endHours && endMinutes) {
      endDate.setHours(parseInt(endHours), parseInt(endMinutes), 0);
    }
    
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.title,
      description: event.description,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      location: {
        '@type': 'Place',
        name: event.location,
        address: {
          '@type': 'PostalAddress',
          addressLocality: event.lga || event.location.split(',')[1]?.trim() || '',
          addressRegion: event.state || '',
          addressCountry: 'NG',
          streetAddress: event.address,
        },
      },
      organizer: {
        '@type': 'Organization',
        name: event.host,
        ...(event.organizerEmail && { email: event.organizerEmail }),
        ...(event.organizerPhone && { telephone: event.organizerPhone }),
      },
      image: event.flyer,
      offers: event.isPaid ? {
        '@type': 'Offer',
        price: event.price?.replace(/[^\d.]/g, '') || '0',
        priceCurrency: 'NGN',
        availability: 'https://schema.org/InStock',
        url: currentUrl,
      } : {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'NGN',
        availability: 'https://schema.org/InStock',
        url: currentUrl,
      },
    };
  })() : null;

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-pink-500 selection:text-white">
      {/* Structured Data for SEO */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      {/* Header / Nav */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-lg shadow-lg shadow-pink-500/10 text-slate-900">
              <PartyPopper size={24} />
              </div>
              <span className="text-xl font-bold text-white hidden md:block">Skiboh</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/events" className="hidden md:block">
              <Button className="py-2.5 px-6 text-sm shadow-pink-500/20">Browse Events</Button>
            </Link>
            <Link href="/dashboard/event/new" className="hidden md:block">
              <Button className="py-2.5 px-6 text-sm shadow-pink-500/20">Host a Party</Button>
            </Link>
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="pt-32 pb-20 px-4 md:px-6">
        {/* Background blobs */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-32 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto space-y-8 relative z-10">
          {/* Back link */}
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 font-medium hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Events
          </Link>

        {/* Event Card */}
        <div className="grid lg:grid-cols-2 gap-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-3xl overflow-hidden">
          {/* Flyer */}
          <div className="relative h-[400px] lg:h-auto group overflow-hidden">
            <Image
              src={event.flyer}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
            
            <div className="absolute top-6 left-6 flex gap-2">
               <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${event.isPaid ? 'bg-pink-500 text-white' : 'bg-green-500 text-white'}`}>
                 {event.isPaid ? 'Paid Event' : 'Free Entry'}
               </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-8 md:p-10 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              {/* Title + Rating */}
              <div>
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-pink-500 uppercase tracking-wider">
                        {event.tags?.[0] || 'Party'}
                    </span>
                    {event.rating && (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-5 h-5 fill-yellow-400" />
                        <span className="font-bold">{event.rating.toFixed(1)}</span>
                      </div>
                    )}
                 </div>
                 <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{event.title}</h1>
              </div>

              {/* Tags */}
              {event.tags && (
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Meta Info - BLURRED SECTION for Free Events */}
              <div className={`relative transition-all duration-500 ${isBlurred ? 'blur-sm select-none' : ''}`}>
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                    <div className="p-3 rounded-xl bg-slate-800 text-pink-500">
                       <CalendarDays className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 font-medium">Date & Time</div>
                      <div className="text-lg font-bold text-white mt-1">{event.date}</div>
                      <div className="text-slate-400">{event.time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                    <div className="p-3 rounded-xl bg-slate-800 text-yellow-500">
                       <MapPin className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-400 font-medium">Location</div>
                      <div className="text-lg font-bold text-white mt-1">{event.location}</div>
                      {!isBlurred && event.address && (
                        <div className="text-sm text-slate-400 mt-1">{event.address}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                    <div className="p-3 rounded-xl bg-slate-800 text-blue-400">
                       <User className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-400 font-medium">Organizer</div>
                      <div className="text-lg font-bold text-white mt-1">{event.host}</div>
                      {!isBlurred && contactRevealed && event.organizerPhone && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Phone size={14} className="text-green-400" />
                            <span>{event.organizerPhone}</span>
                          </div>
                          {event.organizerEmail && (
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <span className="text-slate-400">Email:</span>
                              <span>{event.organizerEmail}</span>
                            </div>
                          )}
                          {event.organizerPhone && (
                            <a
                              href={getWhatsAppLink(event.organizerPhone)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 mt-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              <MessageCircle size={16} />
                              Message on WhatsApp
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reveal Overlay */}
                {isBlurred && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className="bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-slate-700 text-center shadow-2xl transform scale-105">
                      <Lock className="w-10 h-10 text-pink-500 mx-auto mb-3" />
                      <h3 className="text-lg font-bold text-white mb-2">Hidden Details</h3>
                      <p className="text-slate-400 text-sm mb-4">Reveal location & organizer details to join.</p>
                      <button 
                        onClick={handleRevealDetails}
                        className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-yellow-500 to-pink-600 hover:scale-105 transition transform flex items-center gap-2 mx-auto"
                      >
                        <Eye className="w-4 h-4" />
                        See Organizer Details
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-white mb-3">About the Event</h2>
                <p className="leading-relaxed text-slate-400">{event.description}</p>
              </div>
            </div>

            {/* Attendees + Actions */}
            <div className="space-y-6 pt-6 border-t border-slate-800">
              {/* Contact Details Section for Paid Events */}
              {event.isPaid && contactRevealed && event.organizerPhone && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-500/10 to-yellow-500/10 border border-pink-500/20">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-pink-500" />
                    Contact Organizer for Tickets
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-800">
                        <Phone size={18} className="text-green-400" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Phone Number</div>
                        <div className="text-lg font-bold text-white">{event.organizerPhone}</div>
                      </div>
                    </div>
                    {event.organizerEmail && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-800">
                          <User size={18} className="text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-400">Email</div>
                          <div className="text-lg font-bold text-white">{event.organizerEmail}</div>
                        </div>
                      </div>
                    )}
                    <a
                      href={getWhatsAppLink(event.organizerPhone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20"
                    >
                      <MessageCircle size={20} />
                      Message on WhatsApp
                    </a>
                  </div>
                </div>
              )}

              {/* Contact Details Section for Free Events (shown after reveal) */}
              {!event.isPaid && !isBlurred && contactRevealed && event.organizerPhone && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                    RSVP Contact Details
                  </h3>
                  <div className="space-y-3">
                    {event.address && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-slate-800 mt-1">
                          <MapPin size={18} className="text-yellow-400" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-400">Full Address</div>
                          <div className="text-base font-medium text-white">{event.address}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-800">
                        <Phone size={18} className="text-green-400" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Contact Number</div>
                        <div className="text-lg font-bold text-white">{event.organizerPhone}</div>
                      </div>
                    </div>
                    {event.organizerEmail && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-800">
                          <User size={18} className="text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-400">Email</div>
                          <div className="text-lg font-bold text-white">{event.organizerEmail}</div>
                        </div>
                      </div>
                    )}
                    <a
                      href={getWhatsAppLink(event.organizerPhone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20"
                    >
                      <MessageCircle size={20} />
                      RSVP on WhatsApp
                    </a>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {event.isPaid ? (
                  <button 
                    onClick={handleGetTickets}
                    disabled={contactRevealed}
                    className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg text-white transition transform shadow-lg 
                    ${contactRevealed 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                      : 'cursor-pointer bg-gradient-to-r from-yellow-500 to-pink-600 hover:scale-[1.02] shadow-pink-500/20'}`}
                  >
                    {contactRevealed ? 'Contact Details Revealed' : `Get Tickets • ${event.price || 'Contact for Price'}`}
                  </button>
                ) : (
                   <button 
                     onClick={handleRevealDetails}
                     disabled={!isBlurred && contactRevealed}
                     className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg text-white transition transform shadow-lg 
                     ${isBlurred 
                        ? 'bg-gradient-to-r from-yellow-500 to-pink-600 hover:scale-[1.02] shadow-pink-500/20' 
                        : contactRevealed
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.02] shadow-green-500/20'}`}
                   >
                     {isBlurred ? 'Reveal Details to RSVP' : contactRevealed ? 'Details Revealed' : 'RSVP for Free'}
                   </button>
                )}
                
                <button
                  onClick={copyLink}
                  className="px-6 py-4 rounded-xl border border-slate-700 hover:bg-slate-800 transition text-slate-300 flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  {isCopySuccess ? <span className="text-green-500 font-bold">Copied!</span> : 'Share'}
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </main>
  );
}
