'use client'
import { useState } from "react";
import { Menu, Users, Calendar, Flag, LogOut, Search, Bell } from "lucide-react";
import Link from "next/link";

export default function GradientDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

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
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-lg flex items-center justify-center text-lg shadow-lg group-hover:shadow-pink-500/20 transition-all">
              🐝
            </div>
            <span className="font-bold text-white text-lg tracking-tight">Skiboh</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="text-xs font-bold text-slate-500 px-4 mb-2 uppercase tracking-wider">Main</div>
          {[
            { id: "dashboard", label: "Dashboard", icon: <Menu size={18} /> },
            { id: "users", label: "Users", icon: <Users size={18} /> },
            { id: "events", label: "Events", icon: <Calendar size={18} /> },
            { id: "reports", label: "Reports", icon: <Flag size={18} /> },
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-pink-500" />
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate">Admin User</div>
              <div className="text-xs text-slate-500 truncate">super@partybees.com</div>
            </div>
          </div>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 transition-colors">
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
                className="bg-slate-950 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-pink-500/50 w-64 transition-all"
              />
            </div>
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full border-2 border-slate-900"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                      <Users size={24} />
                    </div>
                    <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">+12%</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total Users</p>
                  <p className="text-3xl font-black text-white mt-1">1,245</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400">
                      <Calendar size={24} />
                    </div>
                    <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">+5%</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Active Events</p>
                  <p className="text-3xl font-black text-white mt-1">34</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
                      <Flag size={24} />
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-full">0%</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Pending Reports</p>
                  <p className="text-3xl font-black text-white mt-1">12</p>
                </div>
              </div>

              {/* Recent Activity Mock */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                        <Users size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">New user registration <span className="text-slate-500">@user{i}</span></p>
                        <p className="text-xs text-slate-500">2 minutes ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-2xl border border-slate-800 shadow-sm text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                <Users size={32} />
              </div>
              <p className="font-medium text-white">Users Management</p>
              <p className="text-sm text-slate-500 mt-1">Table view coming soon...</p>
            </div>
          )}

          {activeTab === "events" && (
            <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-2xl border border-slate-800 shadow-sm text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                <Calendar size={32} />
              </div>
              <p className="font-medium text-white">Events Management</p>
              <p className="text-sm text-slate-500 mt-1">Moderation tools coming soon...</p>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-2xl border border-slate-800 shadow-sm text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                <Flag size={32} />
              </div>
              <p className="font-medium text-white">Safety Reports</p>
              <p className="text-sm text-slate-500 mt-1">Review user flags here...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
