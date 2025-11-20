'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MediaGallery from '@/components/MediaGallery';
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
  PartyPopper,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UserMenu } from '@/components/UserMenu';
import { useParams } from 'next/navigation';

type Attendee = { name: string; avatarUrl?: string };

interface Event {
  _id: string;
  title: string;
  slug: string;
  startDateTime: string;
  endDateTime: string;
  date: string;
  time: string;
  state: string;
  lga: string;
  location: string;
  address: string;
  host: string;
  hostId: string;
  isoDate: string;
  organizerPhone: string;
  organizerEmail: string;
  flyer: string;
  media?: {
    url: string;
    type: 'image' | 'video';
    order: number;
  }[];
  description: string;
  isPaid: boolean;
  price?: string;
  paymentDetails?: string;
  labels: string[];
  tags?: string[]; // Added tags to interface
  rating?: number;
  attendees?: Attendee[];
}


export default function EventDetailsPage() {
  const params = useParams() as { id?: string };
  const slug = params?.id;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // Blur state for free events
  const [isBlurred, setIsBlurred] = useState(true);
  // Contact details revealed state for paid events
  const [contactRevealed, setContactRevealed] = useState(false);
  // Interest form modal state
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [interestForm, setInterestForm] = useState({ name: '', phone: '', email: '', acceptedTerms: false });
  const [submittingInterest, setSubmittingInterest] = useState(false);
  const [interestSubmitted, setInterestSubmitted] = useState(false);

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
            _id: String(eventData._id || eventData.id || ''),
            title: eventData.title,
            slug: eventData.slug,
            startDateTime: eventData.startDateTime,
            endDateTime: eventData.endDateTime,
            date: `${startDate.toLocaleDateString('en-US', { weekday: 'short' })} • ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
            isoDate: startDate.toISOString().split('T')[0],
            time: `${startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} – ${endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
            location: `${eventData.address}, ${eventData.lga}, ${eventData.state}`,
            address: eventData.address,
            state: eventData.state,
            lga: eventData.lga,
            host: eventData.host,
            hostId: eventData.hostId,
            organizerPhone: eventData.organizerPhone,
            organizerEmail: eventData.organizerEmail,
            flyer: eventData.flyer || eventData.image || 'https://picsum.photos/1600/1000',
            media: eventData.media,
            description: eventData.description,
            labels: eventData.labels || [],
            tags: eventData.labels || [],
            attendees: [],
            rating: undefined,
            isPaid: eventData.isPaid,
            price: eventData.price,
            paymentDetails: eventData.paymentDetails,
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
    // Show interest form before revealing details
    setShowInterestForm(true);
  };

  const handleGetTickets = () => {
    // Show interest form before showing contact
    setShowInterestForm(true);
  };

  const handleSubmitInterest = async () => {
    if (!interestForm.name || !interestForm.phone) {
      alert('Please fill in your name and phone number');
      return;
    }

    if (!interestForm.acceptedTerms) {
      alert('You must accept the terms and conditions');
      return;
    }

    setSubmittingInterest(true);

    try {
      const res = await fetch(`/api/events/${slug}/attendees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interestForm)
      });

      const data = await res.json();

      if (data.success) {
        setInterestSubmitted(true);
        setShowInterestForm(false);
        setIsBlurred(false);
        setContactRevealed(true);
      } else {
        alert(data.error || 'Failed to submit interest');
      }
    } catch (error) {
      console.error('Submit interest error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmittingInterest(false);
    }
  };

  const handleContactOrganizer = () => {
    // Redirect through backend API to hide phone number
    window.location.href = `/api/events/${slug}/contact-organizer`;
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
              <Button variant="simple" className="py-2.5 px-6 text-sm shadow-pink-500/20">Browse Events</Button>
            </Link>
            <Link href="/dashboard/event/new" className="hidden md:block">
              <Button variant="simple" className="py-2.5 px-6 text-sm shadow-pink-500/20">Host a Party</Button>
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
            {/* Media Gallery */}
            <div className="relative lg:h-auto group overflow-hidden bg-slate-950">
              <MediaGallery
                media={
                  event.media && event.media.length > 0
                    ? event.media
                    : event.flyer
                      ? [{ url: event.flyer, type: 'image' as const, order: 0 }]
                      : []
                }
              />

              <div className="absolute top-6 left-6 flex gap-2 z-10">
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

                {/* Meta Info - Always visible except full address */}
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
                      {contactRevealed && event.address && (
                        <div className="text-sm text-slate-400 mt-1">{event.address}</div>
                      )}
                      {!contactRevealed && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                          <Lock className="w-3 h-3" />
                          <span>Full address revealed after RSVP</span>
                        </div>
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
                      {!contactRevealed && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                          <Lock className="w-3 h-3" />
                          <span>Contact details revealed after RSVP</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">About the Event</h2>
                  <p className="leading-relaxed text-slate-400">{event.description}</p>
                </div>
              </div>

              {/* Attendees + Actions */}
              <div className="space-y-6 pt-6 border-t border-slate-800">
                {/* Contact Organizer Section for Paid Events */}
                {event.isPaid && contactRevealed && (
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-500/10 to-yellow-500/10 border border-pink-500/20">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-pink-500" />
                      Contact Organizer for Tickets
                    </h3>
                    <p className="text-slate-300 text-sm mb-4">
                      Click the button below to contact the organizer via WhatsApp to purchase tickets for this event.
                    </p>
                    <button
                      onClick={handleContactOrganizer}
                      className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20 cursor-pointer"
                    >
                      <MessageCircle size={20} />
                      Message on WhatsApp
                    </button>
                  </div>
                )}

                {/* Contact Organizer Section for Free Events */}
                {!event.isPaid && !isBlurred && contactRevealed && (
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-green-500" />
                      RSVP via WhatsApp
                    </h3>
                    {event.address && (
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-slate-800 mt-1">
                          <MapPin size={18} className="text-yellow-400" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-400">Full Address</div>
                          <div className="text-base font-medium text-white">{event.address}</div>
                        </div>
                      </div>
                    )}
                    <p className="text-slate-300 text-sm mb-4">
                      Click the button below to RSVP and get more event details from the organizer on WhatsApp.
                    </p>
                    <button
                      onClick={handleContactOrganizer}
                      className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20 cursor-pointer"
                    >
                      <MessageCircle size={20} />
                      RSVP on WhatsApp
                    </button>
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
      {/* Interest Form Modal */}
      {showInterestForm && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-pink-600 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Show Your Interest!</h3>
              <button
                onClick={() => setShowInterestForm(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-slate-300 text-sm">
                Please provide your details so the organizer can keep you updated about this event.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={interestForm.name}
                    onChange={e => setInterestForm({ ...interestForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={interestForm.phone}
                    onChange={e => setInterestForm({ ...interestForm, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                    placeholder="+234 800 000 0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address <span className="text-slate-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={interestForm.email}
                    onChange={e => setInterestForm({ ...interestForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                  <input
                    type="checkbox"
                    id="interestTerms"
                    checked={interestForm.acceptedTerms}
                    onChange={e => setInterestForm({ ...interestForm, acceptedTerms: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-pink-500 focus:ring-pink-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="interestTerms" className="text-xs text-slate-300 cursor-pointer">
                    I agree to the{' '}
                    <Link href="/terms" target="_blank" className="text-pink-400 hover:text-pink-300 underline">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" target="_blank" className="text-pink-400 hover:text-pink-300 underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <button
                  onClick={handleSubmitInterest}
                  disabled={submittingInterest}
                  className="w-full py-4 rounded-xl text-white font-bold bg-gradient-to-r from-yellow-500 to-pink-600 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submittingInterest ? 'Submitting...' : 'Submit & Continue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
