"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface EventFormData {
  title: string;
  date: string;
  time: string;
  location: string;
  host: string;
  flyer: string;
  description: string;
  tags: string[];
}

export default function HostEventPage() {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    date: "",
    time: "",
    location: "",
    host: "",
    flyer: "",
    description: "",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Event Data:", formData);
    // TODO: send formData to backend
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-50 to-white overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-yellow-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl" />

      {/* Card */}
      <div className="w-full max-w-7xl mx-auto relative z-10 bg-white/90 rounded-3xl shadow-2xl overflow-hidden">
        {/* Back Link */}
        <div className="absolute top-4 left-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 text-slate-700 font-medium shadow hover:bg-white hover:shadow-md transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Events
          </Link>
        </div>

        {/* Gradient header */}
        <div className="h-32 bg-gradient-to-r from-yellow-400 to-pink-500 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">🎉 Host Event</span>
        </div>

        <div className="p-8 space-y-6">
          <h1 className="text-2xl font-bold text-yellow-700">Create Your Event</h1>
          <p className="text-sm text-slate-600">
            Fill in the details to share your event with the world.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="title"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-700 focus:ring-4 focus:ring-yellow-200/70 focus:border-yellow-400 outline-none transition"
            />

            <div className="flex flex-col md:flex-row gap-4">
              <input
                name="date"
                placeholder="Date (e.g., Sat • Sept 20, 2025)"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 focus:ring-4 focus:ring-yellow-200/70 focus:border-yellow-400 outline-none transition"
              />
              <input
                name="time"
                placeholder="Time (e.g., 19:00 – 02:00)"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 focus:ring-4 focus:ring-yellow-200/70 focus:border-yellow-400 outline-none transition"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 focus:ring-4 focus:ring-yellow-200/70 focus:border-yellow-400 outline-none transition"
              />
              <input
                name="host"
                placeholder="Host (e.g., DJ Spinall)"
                value={formData.host}
                onChange={handleChange}
                required
                className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 focus:ring-4 focus:ring-yellow-200/70 focus:border-yellow-400 outline-none transition"
              />
            </div>

            <input
              name="flyer"
              placeholder="Flyer URL"
              value={formData.flyer}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-700 focus:ring-4 focus:ring-yellow-200/70 focus:border-yellow-400 outline-none transition"
            />

            <textarea
              name="description"
              placeholder="Event Description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-700 focus:ring-4 focus:ring-yellow-200/70 focus:border-yellow-400 outline-none transition min-h-[120px]"
            />

            {/* Tags */}
            <div>
              <input
                placeholder="Add a tag and press Enter (e.g., AfroBeats)"
                value={tagInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTagInput(e.target.value)
                }
                onKeyDown={handleAddTag}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-700 focus:ring-4 focus:ring-yellow-200/70 focus:border-yellow-400 outline-none transition"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-yellow-400 to-pink-500 shadow-lg hover:shadow-2xl transform hover:scale-[1.03] transition"
            >
              Create Event
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
