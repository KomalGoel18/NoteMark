"use client";

import API from "@/lib/api";
import { useEffect, useState } from "react";

export default function StarredPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    fetchStarred();
  }, []);

  const fetchStarred = async () => {
    const notesRes = await API.get("/notes?favorite=true");
    const bmRes = await API.get("/bookmarks?favorite=true");

    setNotes(notesRes.data.notes);
    setBookmarks(bmRes.data.bookmarks);
  };

  return (
    <main className="flex-1 p-8 bg-[#0f1419] min-h-screen text-white">

      <h1 className="text-2xl font-semibold mb-6">
        ⭐ Your Starred
      </h1>

      <h2 className="text-lg mb-4">Notes</h2>

      {notes.length === 0 ? (
        <p className="text-gray-400 mb-10">No starred notes</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 mb-10">
          {notes.map((n) => (
            <div
              key={n._id}
              className="bg-[#1a2332] border border-[#2d3748] rounded-lg p-5"
            >
              <h3 className="font-semibold mb-2">{n.title}</h3>
              <p className="text-gray-400 text-sm">{n.content}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-lg mb-4">Bookmarks</h2>

      {bookmarks.length === 0 ? (
        <p className="text-gray-400">No starred bookmarks</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {bookmarks.map((b) => (
            <div
              key={b._id}
              className="bg-[#1a2332] border border-[#2d3748] rounded-lg p-5"
            >
              <h3 className="font-semibold mb-2">{b.title}</h3>
              <a
                href={b.url}
                target="_blank"
                className="text-blue-400 text-sm"
              >
                Visit
              </a>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
