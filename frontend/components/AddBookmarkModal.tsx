"use client";

import { useState, useEffect } from "react";
import API from "@/lib/api";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchBookmarks: () => void;
  bookmark?: any; // 👈 edit mode
}

export default function AddBookmarkModal({
  isOpen,
  onClose,
  fetchBookmarks,
  bookmark,
}: AddBookmarkModalProps) {
  const isEditMode = !!bookmark;

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 🧠 Prefill in edit mode
  useEffect(() => {
    if (bookmark) {
      setUrl(bookmark.url);
      setTitle(bookmark.title || "");
      setDescription(bookmark.description || "");
      setTags(bookmark.tags || []);
    }
  }, [bookmark]);

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!url.trim()) return alert("URL is required");

    try {
      setLoading(true);

      const payload = {
        url,
        title,
        description,
        tags,
      };

      if (isEditMode) {
        await API.put(`/bookmarks/${bookmark._id}`, payload);
      } else {
        await API.post("/bookmarks", payload);
      }

      fetchBookmarks();
      handleClose();
    } catch (err) {
      console.error("Failed to save bookmark", err);
      alert("Failed to save bookmark");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUrl("");
    setTitle("");
    setDescription("");
    setTags([]);
    setTagInput("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1a2332] border-[#2d3748] text-white max-w-lg p-0 [&>button]:hidden">

        {/* HEADER */}
        <div className="p-6 border-b border-[#2d3748] flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Edit Bookmark" : "Add New Bookmark"}
          </h2>

          <button onClick={handleClose} className="text-gray-400 hover:text-white">
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">

          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-[#0f1419] border-[#2d3748] text-white h-12"
          />

          <Input
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-[#0f1419] border-[#2d3748] text-white h-12"
          />

          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-[#0f1419] border-[#2d3748] text-white min-h-[100px]"
          />

          {/* TAG INPUT */}
          <div className="flex flex-wrap gap-2 p-3 bg-[#0f1419] border border-[#2d3748] rounded-md">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-600 text-sm rounded flex items-center gap-1"
              >
                {tag}
                <button onClick={() => removeTag(tag)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Add tag..."
              className="bg-transparent outline-none text-sm text-white flex-1"
            />
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-[#2d3748] flex justify-end gap-3">

          <Button
            onClick={handleClose}
            variant="outline"
            className="bg-transparent border-[#2d3748] text-gray-300 hover:bg-[#2d3748]"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
          >
            {loading
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
              ? "Update Bookmark"
              : "Save Bookmark"}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}
