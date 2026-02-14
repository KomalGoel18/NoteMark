"use client";

import API from "@/lib/api";
import {
  FileText,
  Bookmark,
  LogOut,
  Search,
  Star,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddBookmarkModal from "@/components/AddBookmarkModal";
import { useAuthStore } from "@/store/auth";

export default function BookmarksPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🔐 Protect route
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
    } else {
      fetchBookmarks();
    }
  }, [router]);

  // 🔎 Debounced search
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchBookmarks(search);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  const fetchBookmarks = async (query = "") => {
    try {
      setLoading(true);
      const res = await API.get(`/bookmarks?q=${query}`);
      setBookmarks(res.data.bookmarks);
    } catch {
      console.error("Failed to fetch bookmarks");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      await API.patch(`/bookmarks/${id}/favorite`);
      fetchBookmarks(search);
    } catch {
      console.error("Failed to toggle favorite");
    }
  };

  const deleteBookmark = async (id: string) => {
    try {
      await API.delete(`/bookmarks/${id}`);
      fetchBookmarks(search);
    } catch {
      console.error("Failed to delete bookmark");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#0f1419] flex">
      {/* SIDEBAR */}
      <aside className="w-60 bg-[#0a0e13] border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <Link href="/notes" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-white">
              NoteMark
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/notes"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800/50"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Notes</span>
          </Link>

          <Link
            href="/bookmarks"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600/10 text-blue-500"
          >
            <Bookmark className="w-5 h-5" />
            <span className="font-medium">Bookmarks</span>
            <span className="ml-auto bg-blue-600/20 text-blue-400 text-xs font-medium px-2 py-1 rounded">
              {bookmarks.length}
            </span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="h-20 border-b border-gray-800 flex items-center justify-between px-8">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your bookmarks..."
              className="pl-10 bg-[#1a2332] border-[#2d3748] text-white"
            />
          </div>

          <Button onClick={() => setIsCreateOpen(true)}>
            + Add Bookmark
          </Button>
        </header>

        {/* CONTENT */}
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-semibold text-white mb-6">
            Your Bookmarks
          </h1>

          {loading ? (
            <p className="text-gray-400">Loading bookmarks...</p>
          ) : bookmarks.length === 0 ? (
            <p className="text-gray-400">No bookmarks yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {bookmarks.map((bm) => (
                <div
                  key={bm._id}
                  className="bg-[#1a2332] border border-[#2d3748] rounded-lg p-5"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="text-white font-semibold">
                      {bm.title}
                    </h3>

                    <div className="flex gap-2">
                      <button onClick={() => toggleFavorite(bm._id)}>
                        <Star
                          className={`w-5 h-5 ${
                            bm.isFavorite
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-gray-400"
                          }`}
                        />
                      </button>

                      <button onClick={() => deleteBookmark(bm._id)}>
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>

                  <a
                    href={bm.url}
                    target="_blank"
                    className="text-blue-400 text-sm flex items-center gap-1 mb-2 hover:underline"
                  >
                    Visit <ExternalLink className="w-4 h-4" />
                  </a>

                  <p className="text-gray-400 text-sm mb-3">
                    {bm.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {bm.tags?.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      <AddBookmarkModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        fetchBookmarks={() => fetchBookmarks(search)}
      />
    </div>
  );
}
