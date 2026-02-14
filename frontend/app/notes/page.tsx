"use client";

import API from "@/lib/api";
import {
  FileText,
  Bookmark,
  LogOut,
  Search,
  Star,
  Trash2,
  Pencil,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreateNoteModal from "@/components/CreateNoteModal";
import { useAuthStore } from "@/store/auth";

export default function NotesPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);

  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  // 🔐 Protect route
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
    } else {
      fetchNotes();
    }
  }, [router]);

  // 🔎 Refetch when search OR tag changes
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchNotes(search, tagFilter);
    }, 400);

    return () => clearTimeout(delay);
  }, [search, tagFilter]);

  const fetchNotes = async (query = "", tag = "") => {
    try {
      setLoading(true);

      const res = await API.get(
        `/notes?q=${query}${tag ? `&tags=${tag}` : ""}`
      );

      setNotes(res.data.notes);
    } catch {
      console.error("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: string) => {
    await API.patch(`/notes/${id}/favorite`);
    fetchNotes(search, tagFilter);
  };

  const deleteNote = async (id: string) => {
    await API.delete(`/notes/${id}`);
    fetchNotes(search, tagFilter);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const openCreateModal = () => {
    setSelectedNote(null);
    setIsCreateNoteOpen(true);
  };

  const openEditModal = (note: any) => {
    setSelectedNote(note);
    setIsCreateNoteOpen(true);
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
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600/10 text-blue-500"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Notes</span>
            <span className="ml-auto bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded">
              {notes.length}
            </span>
          </Link>

          <Link
            href="/bookmarks"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800/50"
          >
            <Bookmark className="w-5 h-5" />
            <span className="font-medium">Bookmarks</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
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
              placeholder="Search your notes..."
              className="pl-10 bg-[#1a2332] border-[#2d3748] text-white"
            />
          </div>

          <Button onClick={openCreateModal}>+ Create Note</Button>
        </header>

        {/* ACTIVE TAG FILTER */}
        {tagFilter && (
          <div className="px-8 pt-4 flex items-center gap-2 text-sm text-blue-400">
            Filtering by: <b>{tagFilter}</b>
            <button onClick={() => setTagFilter("")}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* CONTENT */}
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-semibold text-white mb-6">
            Your Notes
          </h1>

          {loading ? (
            <p className="text-gray-400">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="text-gray-400">No notes yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-[#1a2332] border border-[#2d3748] rounded-lg p-5"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="text-white font-semibold">
                      {note.title}
                    </h3>

                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(note)}>
                        <Pencil className="w-4 h-4 text-blue-400" />
                      </button>

                      <button onClick={() => toggleFavorite(note._id)}>
                        <Star
                          className={`w-5 h-5 ${
                            note.isFavorite
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-gray-400"
                          }`}
                        />
                      </button>

                      <button onClick={() => deleteNote(note._id)}>
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-3">
                    {note.content}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {note.tags?.map((tag: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setTagFilter(tag)}
                        className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/40"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      <CreateNoteModal
        isOpen={isCreateNoteOpen}
        onClose={() => setIsCreateNoteOpen(false)}
        fetchNotes={() => fetchNotes(search, tagFilter)}
        note={selectedNote}
      />
    </div>
  );
}
