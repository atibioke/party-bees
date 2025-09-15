'use client'
import { useState } from "react";
import { Menu, Users, Calendar, Flag } from "lucide-react";
import Link from "next/link";





export default function GradientDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen text-slate-700 bg-gradient-to-br from-yellow-100 via-pink-50 to-white relative">

      <aside className="w-60 relative z-10 bg-white/40 backdrop-blur-xl border-r border-white/30 flex flex-col shadow-md">
       <div className="px-4 py-6 text-xl font-bold border-b border-white/30 relative">
    <Link
      href="/"
      className="inline-block mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-400 
                 text-white font-medium shadow-md hover:shadow-lg transition"
    >
      ← 
    </Link>
    Party Bees 🐝
  </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: <Menu size={18} /> },
            { id: "users", label: "Users", icon: <Users size={18} /> },
            { id: "events", label: "Events", icon: <Calendar size={18} /> },
            { id: "reports", label: "Reports", icon: <Flag size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-medium shadow-sm"
                  : "hover:bg-white/40"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header className="h-14 bg-white/40 backdrop-blur-xl border-b border-white/30 flex items-center justify-between px-4 shadow-sm">
          <h1 className="text-lg font-semibold capitalize">{activeTab}</h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400" />
            <span className="text-sm font-medium">Admin</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-sm">
                <p className="text-sm text-slate-500">Total Users</p>
                <p className="text-2xl font-bold">1,245</p>
              </div>
              <div className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-sm">
                <p className="text-sm text-slate-500">Active Events</p>
                <p className="text-2xl font-bold">34</p>
              </div>
              <div className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-sm">
                <p className="text-sm text-slate-500">Reports</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-sm">
              <p className="font-medium">Users List (placeholder)</p>
            </div>
          )}

          {activeTab === "events" && (
            <div className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-sm">
              <p className="font-medium">Events Table (placeholder)</p>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-sm">
              <p className="font-medium">Reports Panel (placeholder)</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}



