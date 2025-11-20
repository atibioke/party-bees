'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Calendar, LogOut, Menu, X, Plus, PartyPopperIcon } from "lucide-react";

interface TabButtonProps {
    active: boolean;
    label: string;
    icon: React.ElementType;
    href: string;
}

const TabButton = ({ active, label, icon: Icon, href }: TabButtonProps) => (
    <Link href={href}>
        <button
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 mt-2 cursor-pointer ${active
                ? "bg-white text-slate-900 shadow-md"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
        >
            <Icon size={18} className={active ? "text-pink-600" : ""} />
            <span className="flex-1 text-left">{label}</span>
        </button>
    </Link>
);

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [profile, setProfile] = useState<{ businessName?: string; email?: string; _id?: string } | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/auth/me', { cache: 'no-store' });
                const data = await res.json();

                // Only redirect on authentication errors (401, 403)
                if (res.status === 401 || res.status === 403) {
                    router.push('/login');
                    return;
                }

                if (data.success && data.data) {
                    setProfile(data.data);
                } else if (res.status >= 400) {
                    // Only redirect on client/server errors, not on network issues
                    console.error("Failed to fetch profile:", data.error || 'Unknown error');
                    // Don't redirect immediately - let the user see the error or retry
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
                // Don't redirect on network errors - might be temporary
            } finally {
                setIsLoadingProfile(false);
            }
        };
        fetchProfile();
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0B0F17] text-slate-200 font-sans selection:bg-pink-500/30">

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full z-30 bg-[#0F131D] border-b border-slate-800/60 px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-lg shadow-lg shadow-pink-500/10 text-slate-900">
                    <PartyPopperIcon size={20} />
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight">Skiboh</span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-slate-400 hover:text-white"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside className={`
        w-64 flex-col border-r border-slate-800/60 bg-[#0F131D] fixed h-full z-20 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        pt-16 md:pt-0
      `}>
                <div className="p-6 h-full flex flex-col">
                    <Link href="/" className="hidden md:flex items-center gap-3 mb-10">
                        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-xl shadow-lg shadow-pink-500/10 text-slate-900">

                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">Skiboh</span>
                    </Link>

                    <div className="mb-8">
                        <div className="w-16 h-16 rounded-full border-2 border-slate-800 overflow-hidden mb-3 relative bg-slate-800 flex items-center justify-center">
                            <User size={24} className="text-slate-500" />
                        </div>
                        {isLoadingProfile ? (
                            <div className="space-y-2">
                                <div className="h-5 bg-slate-800 rounded animate-pulse w-24"></div>
                                <div className="h-4 bg-slate-800 rounded w-16 animate-pulse"></div>
                            </div>
                        ) : (
                            <>
                                <h3 className="font-bold text-white">{profile?.businessName || 'User'}</h3>
                                <p className="text-sm text-slate-500">@{profile?.businessName?.toLowerCase().replace(/\s+/g, '_') || profile?.email?.split('@')[0] || 'user'}</p>
                            </>
                        )}
                    </div>

                    <nav className="space-y-1">
                        <TabButton
                            label="Dashboard"
                            icon={Calendar}
                            active={pathname === "/dashboard"}
                            href="/dashboard"
                        />
                        <TabButton
                            label="Create Event"
                            icon={Plus}
                            active={pathname === "/dashboard/event/new"}
                            href="/dashboard/event/new"
                        />
                        {/* We can add more specific tabs if needed, but for now keeping it simple based on routes */}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-slate-800/60">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 text-sm font-medium text-slate-400 hover:text-white transition-colors w-full px-4 py-2 rounded-xl hover:bg-slate-800"
                        >
                            <LogOut size={18} /> Log Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-10 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 p-4 md:p-12 overflow-y-auto pt-20 md:pt-12">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
