'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, Calendar, Plus, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/Button';

interface UserProfile {
  businessName?: string;
  email?: string;
  _id?: string;
}

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success && data.data) {
          setProfile(data.data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setProfile(null);
      setIsOpen(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // If not authenticated, show login/signup buttons
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/login" className="hidden md:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
          Login
        </Link>
        <Link href="/signup" className="hidden md:block">
          <Button variant="simple">
            Sign Up
          </Button>
        </Link>
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-slate-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
            <Link
              href="/login"
              className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="block px-4 py-2 text-sm text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 animate-pulse" />
    );
  }

  const userInitials = profile?.businessName
    ? profile.businessName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : profile?.email?.[0].toUpperCase() || 'U';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop: Avatar with dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex items-center gap-2 p-1 rounded-full hover:bg-slate-800 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 font-semibold text-sm overflow-hidden">
          {userInitials}
        </div>
      </button>

      {/* Desktop Dropdown */}
      {isOpen && (
        <div className="hidden md:block absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-slate-800">
            <div className="text-sm font-semibold text-white truncate">
              {profile?.businessName || 'User'}
            </div>
            <div className="text-xs text-slate-400 truncate">
              {profile?.email}
            </div>
          </div>
          <div className="p-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Calendar size={18} />
              Dashboard
            </Link>
            <Link
              href="/dashboard/event/new"
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Plus size={18} />
              Create Event
            </Link>
            <div className="h-px bg-slate-800 my-2" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Mobile: Hamburger menu */}
      <button
        className="md:hidden p-2 text-slate-300 hover:text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 font-semibold text-sm">
                {userInitials}
              </div>
              <div>
                <div className="text-sm font-semibold text-white truncate">
                  {profile?.businessName || 'User'}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {profile?.email}
                </div>
              </div>
            </div>
          </div>
          <div className="p-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Calendar size={18} />
              Dashboard
            </Link>
            <Link
              href="/dashboard/event/new"
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Plus size={18} />
              Create Event
            </Link>
            <div className="h-px bg-slate-800 my-2" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

