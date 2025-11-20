'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PartyPopper, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserMenu } from '@/components/UserMenu';
import { useToast } from '@/components/ui/Toast';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
        // Reset form
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        showToast(data.error || 'Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      showToast('An unexpected error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4">
              Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600">Us</span>
            </h1>
            <p className="text-xl text-slate-400">
              Have a question or need help? We&apos;re here for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  <Input
                    label="Subject"
                    type="text"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                  />

                  <div>
                    <label className="text-sm font-medium text-slate-300 ml-1 mb-2 block">
                      Message
                    </label>
                    <textarea
                      placeholder="Tell us what's on your mind..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:bg-slate-900 focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Email Us</h3>
                <a
                  href="mailto:support@skiboh.com"
                  className="text-pink-400 hover:text-pink-300 transition-colors"
                >
                  support@skiboh.com
                </a>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Response Time</h3>
                <p className="text-slate-400 text-sm">
                  We typically respond within 24-48 hours during business days.
                </p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Other Ways to Reach Us</h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li>• Check our <Link href="/about" className="text-pink-400 hover:text-pink-300">About page</Link></li>
                  <li>• Read our <Link href="/faq" className="text-pink-400 hover:text-pink-300">FAQ</Link></li>
                  <li>• Follow us on social media</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
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

