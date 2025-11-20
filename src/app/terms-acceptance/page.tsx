'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PartyPopper } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function TermsAcceptancePage() {
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();

    const handleAccept = async () => {
        if (!accepted) {
            showToast('Please accept the terms and conditions', 'error');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/accept-terms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await res.json();

            if (data.success) {
                showToast('Terms accepted successfully!', 'success');
                // Redirect to profile setup or dashboard
                setTimeout(() => {
                    router.push('/profile-setup');
                }, 500);
            } else {
                showToast(data.error || 'Failed to accept terms', 'error');
            }
        } catch (error) {
            console.error('Accept terms error:', error);
            showToast('An error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
            {/* Navigation */}
            <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-lg shadow-lg shadow-pink-500/10 text-slate-900">
                            <PartyPopper size={24} />
                        </div>
                        <span className="text-xl font-bold text-white">Skiboh</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center pt-20 pb-10">
                {/* Background blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 -right-32 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl animate-pulse" />
                </div>

                {/* Card */}
                <div className="w-full max-w-2xl relative z-10 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden mx-4">
                    {/* Gradient header */}
                    <div className="h-24 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <h1 className="text-2xl font-bold text-white tracking-tight relative z-10">Terms & Conditions</h1>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="text-center">
                            <p className="text-slate-300">
                                Before you continue, please review and accept our terms of service and privacy policy.
                            </p>
                        </div>

                        {/* Terms content */}
                        <div className="bg-slate-800/50 rounded-2xl p-6 max-h-96 overflow-y-auto space-y-4 border border-slate-700">
                            <section>
                                <h3 className="text-lg font-bold text-white mb-2">1. Acceptance of Terms</h3>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    By accessing and using Skiboh, you accept and agree to be bound by the terms and provision of this agreement.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-white mb-2">2. User Responsibilities</h3>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    Event organizers are responsible for providing accurate event information and ensuring events comply with local laws.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-white mb-2">3. Privacy</h3>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    We collect and process your data as described in our Privacy Policy. Your information will be used to improve our services.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-white mb-2">4. Limitation of Liability</h3>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    Skiboh acts as a platform connecting event organizers with attendees. We are not responsible for the quality, safety, or legality of events.
                                </p>
                            </section>

                            <div className="pt-4">
                                <p className="text-slate-400 text-xs">
                                    For full terms, visit{' '}
                                    <Link href="/terms" target="_blank" className="text-pink-400 hover:text-pink-300 underline">
                                        Terms of Service
                                    </Link>
                                    {' '}and{' '}
                                    <Link href="/privacy" target="_blank" className="text-pink-400 hover:text-pink-300 underline">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Acceptance checkbox */}
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700">
                            <input
                                type="checkbox"
                                id="acceptTerms"
                                checked={accepted}
                                onChange={e => setAccepted(e.target.checked)}
                                className="mt-1 w-5 h-5 rounded border-slate-600 bg-slate-800 text-pink-500 focus:ring-pink-500 focus:ring-2 cursor-pointer"
                            />
                            <label htmlFor="acceptTerms" className="text-sm text-slate-300 cursor-pointer">
                                I have read and agree to the{' '}
                                <Link href="/terms" target="_blank" className="text-pink-400 hover:text-pink-300 font-medium underline">
                                    Terms of Service
                                </Link>
                                {' '}and{' '}
                                <Link href="/privacy" target="_blank" className="text-pink-400 hover:text-pink-300 font-medium underline">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Submit button */}
                        <button
                            onClick={handleAccept}
                            disabled={!accepted || loading}
                            className="w-full py-4 rounded-xl text-white font-bold bg-gradient-to-r from-yellow-500 to-pink-600 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Processing...' : 'Accept & Continue'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
