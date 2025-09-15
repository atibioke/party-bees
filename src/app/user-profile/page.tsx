'use client'
import { useState } from "react";
import { Edit, Trash2, Eye, Save, User } from "lucide-react";
import Link from "next/link";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<"profile" | "posts">("profile");
  const [profile, setProfile] = useState({
    name: "Jane Doe",
    username: "jane_bee",
    bio: "Lover of parties and vibes 🐝",
    avatar: "",
  });

  const [posts, setPosts] = useState([
    { id: 1, title: "Beach Party 2025", status: "Running" },
    { id: 2, title: "New Year Countdown", status: "Past" },
  ]);

  const handleDelete = (id: number) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div className="flex min-h-screen text-slate-700 bg-gradient-to-br from-yellow-100 via-pink-50 to-white relative">
      {/* Sidebar */}
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

  <nav className="flex-1 px-3 py-4 space-y-2">
    <button
      onClick={() => setActiveTab("profile")}
      className={`w-full text-left px-3 py-2 rounded-md ${
        activeTab === "profile"
          ? "bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-medium"
          : "hover:bg-white/40"
      }`}
    >
      Profile Info
    </button>
    <button
      onClick={() => setActiveTab("posts")}
      className={`w-full text-left px-3 py-2 rounded-md ${
        activeTab === "posts"
          ? "bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-medium"
          : "hover:bg-white/40"
      }`}
    >
      My Posts
    </button>
  </nav>
</aside>


      {/* Main Content */}
      <main className="flex-1 flex justify-center items-start p-8">
        <div className="w-full max-w-3xl bg-white/50 backdrop-blur-md shadow-lg rounded-2xl p-6">
          {/* Profile Info */}
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <div className="flex items-center gap-6 mb-6">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border border-white shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 flex items-center justify-center text-white text-2xl shadow-md">
                    <User />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const url = URL.createObjectURL(e.target.files[0]);
                      setProfile({ ...profile, avatar: url });
                    }
                  }}
                  className="text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md bg-white/70 border border-slate-200 focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-500">Username</label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md bg-white/70 border border-slate-200 focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm text-slate-500">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 rounded-md bg-white/70 border border-slate-200 focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <button className="mt-6 px-4 py-2 rounded-md bg-gradient-to-r from-yellow-400 to-pink-400 text-white flex items-center gap-2">
                <Save size={16} /> Save Changes
              </button>
            </div>
          )}

          {/* My Posts */}
          {activeTab === "posts" && (
            <div>
              <h2 className="text-xl font-bold mb-4">My Posts</h2>
              <ul className="space-y-3">
                {posts.map((post) => (
                  <li
                    key={post.id}
                    className="flex justify-between items-center bg-white/70 p-3 rounded-lg shadow-sm"
                  >
                    <span>{post.title}</span>
                    <div className="flex gap-2">
                      {post.status === "Running" && (
                        <>
                          <button className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-600 flex items-center gap-1">
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="px-2 py-1 text-xs rounded bg-red-100 text-red-600 flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </>
                      )}
                      {post.status === "Past" && (
                        <button className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-600 flex items-center gap-1">
                          <Eye size={14} /> View
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
