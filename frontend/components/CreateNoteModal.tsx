"use client";

import { useState, useEffect } from "react";
import API from "@/lib/api";
import { X, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchNotes: () => void;
  note?: any; // 👈 for edit mode
}

export default function CreateNoteModal({
  isOpen,
  onClose,
  fetchNotes,
  note,
}: CreateNoteModalProps) {
  const isEditMode = !!note;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestions = ["#Ideas", "#Personal", "#Meeting"];

  // 🧠 Prefill in edit mode
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags || []);
    }
  }, [note]);

  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        title,
        content,
        tags,
      };

      if (isEditMode) {
        await API.put(`/notes/${note._id}`, payload);
      } else {
        await API.post("/notes", payload);
      }

      fetchNotes();
      handleClose();
    } catch {
      console.error("Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setTagInput("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1a2332] border-[#2d3748] text-white max-w-2xl h-[90vh] flex flex-col p-0 [&>button]:hidden">

        {/* HEADER */}
        <div className="p-6 border-b border-[#2d3748] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Edit className="w-4 h-4 text-white" />
            </div>

            <h2 className="text-xl font-semibold">
              {isEditMode ? "Edit Note" : "Create New Note"}
            </h2>
          </div>

          <button onClick={handleClose}>
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TITLE */}
          <div>
            <label className="block text-xs text-gray-400 mb-3">Note Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#0f1419] border-[#2d3748] text-white h-12"
            />
          </div>

          {/* CONTENT */}
          <div>
            <label className="block text-xs text-gray-400 mb-3">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-[#0f1419] border-[#2d3748] text-white min-h-[200px]"
            />
          </div>

          {/* TAGS */}
          <div>
            <label className="block text-xs text-gray-400 mb-3">
              Tags
            </label>

            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                placeholder="+ Add tag"
                className="w-32 bg-[#0f1419] border-[#2d3748] text-sm"
              />
            </div>

            <div className="flex gap-2 text-xs text-gray-400">
              Suggestions:
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setTags([...tags, s])}
                  className="hover:text-blue-500"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-[#2d3748] flex justify-end gap-3">
          <Button onClick={handleClose}>Cancel</Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
              ? "Update Note"
              : "Save Note"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
