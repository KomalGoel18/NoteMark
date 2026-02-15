"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Bookmark, Star, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const [notesCount, setNotesCount] = useState(0);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [starredCount, setStarredCount] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const notesRes = await API.get("/notes");
      const bmRes = await API.get("/bookmarks");
      const starredNotes = await API.get("/notes?favorite=true");
      const starredBm = await API.get("/bookmarks?favorite=true");

      setNotesCount(notesRes.data.notes.length);
      setBookmarksCount(bmRes.data.bookmarks.length);
      setStarredCount(
        starredNotes.data.notes.length +
          starredBm.data.bookmarks.length
      );
    } catch (err) {
      console.error("Failed to fetch sidebar counts");
    }
  };

  const navItem = (href: string, icon: any, label: string, count: number) => {
    const Icon = icon;
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
          active
            ? "bg-blue-600/10 text-blue-500"
            : "text-gray-400 hover:bg-gray-800/50"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>

        <span className="ml-auto bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded">
          {count}
        </span>
      </Link>
    );
  };

  return (
    <aside className="w-60 bg-[#0a0e13] border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <Link href="/notes" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
            N
          </div>
          <span className="text-xl font-semibold text-white">NoteMark</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItem("/notes", FileText, "Notes", notesCount)}
        {navItem("/bookmarks", Bookmark, "Bookmarks", bookmarksCount)}
        {navItem("/starred", Star, "Starred", starredCount)}
      </nav>

        <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
