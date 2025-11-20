'use client';

import Link from 'next/link';
import { PartyPopper } from 'lucide-react';
import { UserMenu } from '@/components/UserMenu';

export default function TermsPage() {
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
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-400 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-300 leading-relaxed">
                By accessing and using Skiboh, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Permission is granted to temporarily use Skiboh for personal, non-commercial transitory viewing only. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on Skiboh</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Event Organizers</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Event organizers are responsible for:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Providing accurate event information</li>
                <li>Ensuring events comply with local laws and regulations</li>
                <li>Handling ticket sales and refunds (for paid events)</li>
                <li>Maintaining a safe and respectful environment at their events</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. User Conduct</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Users agree not to:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Post false, misleading, or fraudulent information</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Interfere with or disrupt the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
              <p className="text-slate-300 leading-relaxed">
                Skiboh acts as a platform connecting event organizers with attendees. We are not responsible for:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mt-4">
                <li>The quality, safety, or legality of events listed on our platform</li>
                <li>The accuracy of event information provided by organizers</li>
                <li>Disputes between event organizers and attendees</li>
                <li>Any damages resulting from attendance at events</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Account Termination</h2>
              <p className="text-slate-300 leading-relaxed">
                We reserve the right to terminate or suspend accounts that violate these terms or engage in fraudulent, 
                abusive, or illegal activity. Organizers may have their accounts suspended or banned for violations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Changes to Terms</h2>
              <p className="text-slate-300 leading-relaxed">
                Skiboh reserves the right to revise these terms at any time. By continuing to use the service after 
                changes are posted, you agree to be bound by the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Contact Information</h2>
              <p className="text-slate-300 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:support@skiboh.com" className="text-pink-400 hover:text-pink-300">
                  support@skiboh.com
                </a>
              </p>
            </section>
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

