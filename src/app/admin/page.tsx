'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Menu, Users, Calendar, LogOut, Search, Ban, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/Toast";
import { PartyPopper } from "lucide-react";

interface User {
  _id: string;
  businessName: string;
  email: string;
  whatsapp: string;
  role: 'organizer' | 'admin';
  banned: boolean;
  createdAt: string;
}

interface Event {
  _id: string;
  title: string;
  slug: string;
  host: string;
  state: string;
  lga: string;
  startDateTime: string;
  endDateTime: string;
  flyer?: string;
  isPaid: boolean;
  featured: boolean;
  createdAt: string;
  hostId?: {
    businessName?: string;
    email?: string;
    banned?: boolean;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ businessName?: string; email?: string } | null>(null);

  // Dashboard stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    bannedUsers: 0,
    featuredEvents: 0,
  });

  // Users data
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);

  // Events data
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsPage, setEventsPage] = useState(1);
  const [eventsTotal, setEventsTotal] = useState(0);
  const [eventsFilter, setEventsFilter] = useState<'all' | 'featured' | 'not-featured'>('all');

  // Check admin access
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success && data.data) {
          if (data.data.role !== 'admin') {
            showToast('Access denied. Admin privileges required.', 'error');
            router.push('/dashboard');
            return;
          }
          setProfile(data.data);
          setIsAdmin(true);
          fetchStats();
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Admin check error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [router, showToast]);

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const [usersRes, eventsRes] = await Promise.all([
        fetch('/api/admin/users?limit=1'),
        fetch('/api/admin/events?limit=1'),
      ]);

      const usersData = await usersRes.json();
      const eventsData = await eventsRes.json();

      if (usersData.success && eventsData.success) {
        // Get banned users count
        const bannedRes = await fetch('/api/admin/users?limit=1000');
        const bannedData = await bannedRes.json();
        const bannedCount = bannedData.success ? bannedData.data.filter((u: User) => u.banned).length : 0;

        // Get featured events count
        const featuredRes = await fetch('/api/admin/events?featured=true&limit=1000');
        const featuredData = await featuredRes.json();
        const featuredCount = featuredData.success ? featuredData.data.length : 0;

        setStats({
          totalUsers: usersData.pagination?.total || 0,
          totalEvents: eventsData.pagination?.total || 0,
          bannedUsers: bannedCount,
          featuredEvents: featuredCount,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch users
  const fetchUsers = useCallback(async (page: number = 1, search: string = '') => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      if (search) params.append('search', search);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setUsers(data.data);
        setUsersTotal(data.pagination?.total || 0);
        setUsersPage(page);
      } else {
        showToast(data.error || 'Failed to fetch users', 'error');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Failed to fetch users', 'error');
    } finally {
      setUsersLoading(false);
    }
  }, [showToast]);

  // Fetch events
  const fetchEvents = useCallback(async (page: number = 1, search: string = '', featured?: string) => {
    setEventsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      if (search) params.append('search', search);
      if (featured === 'featured') params.append('featured', 'true');
      else if (featured === 'not-featured') params.append('featured', 'false');

      const res = await fetch(`/api/admin/events?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setEvents(data.data);
        setEventsTotal(data.pagination?.total || 0);
        setEventsPage(page);
      } else {
        showToast(data.error || 'Failed to fetch events', 'error');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      showToast('Failed to fetch events', 'error');
    } finally {
      setEventsLoading(false);
    }
  }, [showToast]);

  // Load data when tab changes
  useEffect(() => {
    if (!isAdmin) return;

    if (activeTab === 'users') {
      fetchUsers(1, searchTerm);
    } else if (activeTab === 'events') {
      fetchEvents(1, searchTerm, eventsFilter === 'all' ? undefined : eventsFilter);
    } else if (activeTab === 'dashboard') {
      fetchStats();
    }
  }, [activeTab, isAdmin, searchTerm, eventsFilter, fetchUsers, fetchEvents]);

  // Handle search
  useEffect(() => {
    if (!isAdmin) return;
    const debounce = setTimeout(() => {
      if (activeTab === 'users') {
        fetchUsers(1, searchTerm);
      } else if (activeTab === 'events') {
        fetchEvents(1, searchTerm, eventsFilter === 'all' ? undefined : eventsFilter);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchTerm, activeTab, eventsFilter, isAdmin, fetchUsers, fetchEvents]);

  // Ban/Unban user
  const handleBanUser = async (userId: string, currentlyBanned: boolean, businessName: string) => {
    const confirmMessage = currentlyBanned
      ? `Are you sure you want to unban "${businessName}"? They will be able to access the platform again.`
      : `Are you sure you want to ban "${businessName}"? They will lose access to the platform and their events may be affected.`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banned: !currentlyBanned }),
      });

      const data = await res.json();

      if (data.success) {
        showToast(data.message || (currentlyBanned ? 'User unbanned' : 'User banned'), 'success');
        fetchUsers(usersPage, searchTerm);
        fetchStats();
      } else {
        showToast(data.error || 'Failed to update user', 'error');
      }
    } catch (error) {
      console.error('Error banning user:', error);
      showToast('Failed to update user', 'error');
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        showToast('Event deleted successfully', 'success');
        fetchEvents(eventsPage, searchTerm, eventsFilter === 'all' ? undefined : eventsFilter);
        fetchStats();
      } else {
        showToast(data.error || 'Failed to delete event', 'error');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      showToast('Failed to delete event', 'error');
    }
  };

  // Feature/Unfeature event
  const handleFeatureEvent = async (eventId: string, currentlyFeatured: boolean) => {
    try {
      const res = await fetch(`/api/admin/events/${eventId}/feature`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentlyFeatured }),
      });

      const data = await res.json();

      if (data.success) {
        showToast(data.message || (currentlyFeatured ? 'Event unfeatured' : 'Event featured'), 'success');
        fetchEvents(eventsPage, searchTerm, eventsFilter === 'all' ? undefined : eventsFilter);
        fetchStats();
      } else {
        showToast(data.error || 'Failed to update event', 'error');
      }
    } catch (error) {
      console.error('Error featuring event:', error);
      showToast('Failed to update event', 'error');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white"><Loader2 size={16} /></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen text-slate-300 bg-slate-950 relative font-sans overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Sidebar */}
      <aside className="w-64 relative z-20 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-lg flex items-center justify-center text-lg shadow-lg group-hover:shadow-pink-500/20 transition-all">
              <PartyPopper size={20} />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">Skiboh Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="text-xs font-bold text-slate-500 px-4 mb-2 uppercase tracking-wider">Main</div>
          {[
            { id: "dashboard", label: "Dashboard", icon: <Menu size={18} /> },
            { id: "users", label: "Organizers", icon: <Users size={18} /> },
            { id: "events", label: "Events", icon: <Calendar size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeTab === tab.id
                  ? "bg-gradient-to-r from-pink-500/20 to-purple-500/10 border border-pink-500/20 text-white font-medium shadow-sm"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <span className={activeTab === tab.id ? "text-pink-400" : "text-slate-500"}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
              {profile?.businessName?.[0] || 'A'}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate">{profile?.businessName || 'Admin'}</div>
              <div className="text-xs text-slate-500 truncate">{profile?.email || ''}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-xl font-bold text-white capitalize">{activeTab}</h1>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Quick search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-pink-500/50 w-64 transition-all"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                      <Users size={24} />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total Organizers</p>
                  <p className="text-3xl font-black text-white mt-1">{stats.totalUsers}</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400">
                      <Calendar size={24} />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total Events</p>
                  <p className="text-3xl font-black text-white mt-1">{stats.totalEvents}</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
                      <Ban size={24} />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Banned Users</p>
                  <p className="text-3xl font-black text-white mt-1">{stats.bannedUsers}</p>
              </div>

                <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400">
                      <Star size={24} />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Featured Events</p>
                  <p className="text-3xl font-black text-white mt-1">{stats.featuredEvents}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Organizers</h2>
                <div className="text-sm text-slate-400">
                  Total: {usersTotal}
                </div>
              </div>

              {usersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 animate-pulse">
                      <div className="h-4 bg-slate-800 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : users.length === 0 ? (
                <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-2xl border border-slate-800 shadow-sm text-center">
                  <Users size={48} className="text-slate-500 mx-auto mb-4" />
                  <p className="font-medium text-white">No organizers found</p>
                  <p className="text-sm text-slate-500 mt-1">Try adjusting your search</p>
                </div>
              ) : (
                <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-800/50 border-b border-slate-800">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Organizer</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">WhatsApp</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {users.map((user) => (
                          <tr key={user._id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-white">{user.businessName}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-300 text-sm">{user.email}</td>
                            <td className="px-6 py-4 text-slate-300 text-sm">{user.whatsapp}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {user.banned ? (
                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400">Banned</span>
                              ) : (
                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">Active</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleBanUser(user._id, user.banned, user.businessName)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                  user.banned
                                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                }`}
                              >
                                {user.banned ? 'Unban' : 'Ban'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {Math.ceil(usersTotal / 20) > 1 && (
                    <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
                      <div className="text-sm text-slate-400">
                        Page {usersPage} of {Math.ceil(usersTotal / 20)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => fetchUsers(usersPage - 1, searchTerm)}
                          disabled={usersPage === 1}
                          className="px-4 py-2 bg-slate-800 rounded-lg text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => fetchUsers(usersPage + 1, searchTerm)}
                          disabled={usersPage >= Math.ceil(usersTotal / 20)}
                          className="px-4 py-2 bg-slate-800 rounded-lg text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl font-bold text-white">Events</h2>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-slate-400">
                    Total: {eventsTotal}
                  </div>
                  <div className="flex gap-2 bg-slate-800 rounded-lg p-1">
                    <button
                      onClick={() => {
                        setEventsFilter('all');
                        fetchEvents(1, searchTerm);
                      }}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        eventsFilter === 'all' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => {
                        setEventsFilter('featured');
                        fetchEvents(1, searchTerm, 'featured');
                      }}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        eventsFilter === 'featured' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Featured
                    </button>
                    <button
                      onClick={() => {
                        setEventsFilter('not-featured');
                        fetchEvents(1, searchTerm, 'not-featured');
                      }}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        eventsFilter === 'not-featured' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Not Featured
                    </button>
                  </div>
                </div>
              </div>

              {eventsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 animate-pulse">
                      <div className="h-32 bg-slate-800 rounded-lg mb-3"></div>
                      <div className="h-4 bg-slate-800 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : events.length === 0 ? (
                <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-2xl border border-slate-800 shadow-sm text-center">
                  <Calendar size={48} className="text-slate-500 mx-auto mb-4" />
                  <p className="font-medium text-white">No events found</p>
                  <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((event) => (
                    <div key={event._id} className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-pink-500/30 transition-all">
                      <div className="relative h-40">
                        <Image
                          src={event.flyer || 'https://picsum.photos/800/600'}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {event.featured && (
                          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Star size={12} className="fill-current" />
                            Featured
                          </div>
                        )}
                        {event.hostId?.banned && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            Organizer Banned
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-white mb-2 line-clamp-2">{event.title}</h3>
                        <div className="space-y-1 text-sm text-slate-400 mb-4">
                          <div>Host: {event.host}</div>
                          <div>{event.lga}, {event.state}</div>
                          <div>{new Date(event.startDateTime).toLocaleDateString()}</div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleFeatureEvent(event._id, event.featured)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              event.featured
                                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {event.featured ? 'Unfeature' : 'Feature'}
                          </button>
                          <Link
                            href={`/events/${event.slug}`}
                            target="_blank"
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDeleteEvent(event._id, event.title)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          )}

              {/* Pagination */}
              {Math.ceil(eventsTotal / 20) > 1 && (
                <div className="flex items-center justify-center gap-4 pt-4">
                  <button
                    onClick={() => fetchEvents(eventsPage - 1, searchTerm, eventsFilter === 'all' ? undefined : eventsFilter)}
                    disabled={eventsPage === 1}
                    className="px-4 py-2 bg-slate-800 rounded-lg text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                  >
                    Previous
                  </button>
                  <div className="text-sm text-slate-400">
                    Page {eventsPage} of {Math.ceil(eventsTotal / 20)}
                  </div>
                  <button
                    onClick={() => fetchEvents(eventsPage + 1, searchTerm, eventsFilter === 'all' ? undefined : eventsFilter)}
                    disabled={eventsPage >= Math.ceil(eventsTotal / 20)}
                    className="px-4 py-2 bg-slate-800 rounded-lg text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                  >
                    Next
                  </button>
              </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
