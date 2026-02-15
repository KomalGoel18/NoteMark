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
  bookmark?: any;
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
  const [inputWidth, setInputWidth] = useState(120);

  useEffect(() => {
    if (bookmark) {
      setUrl(bookmark.url);
      setTitle(bookmark.title || "");
      setDescription(bookmark.description || "");
      setTags(bookmark.tags || []);
    }
  }, [bookmark]);

  useEffect(() => {
  const span = document.getElementById("tag-sizer");
  if (span) {
    span.textContent = tagInput || "Press Enter to add tag";
    setInputWidth(span.offsetWidth + 2);
  }
}, [tagInput]);

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

      const payload = { url, title, description, tags };

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
    <DialogContent className="bg-[#1a2332] border-[#2d3748] text-white max-w-lg w-full p-0 max-h-[90vh] flex flex-col [&>button]:hidden">

      {/* HEADER */}
      <div className="p-6 border-b border-[#2d3748] flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {isEditMode ? "Edit Bookmark" : "Add New Bookmark"}
        </h2>

        <button onClick={handleClose} className="text-gray-400 hover:text-white">
          <X className="w-7 h-7" />
        </button>
      </div>

      {/* SCROLLABLE BODY */}
      <div className="p-6 space-y-5 overflow-y-auto">

        {/* URL */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">
            URL <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-[#0f1419] border-[#2d3748] text-white h-12"
          />
        </div>

        {/* TITLE */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Title (optional)</label>
          <Input
            placeholder="Enter bookmark title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-[#0f1419] border-[#2d3748] text-white h-12"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Description</label>
          <Textarea
            placeholder="Write a short description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-[#0f1419] border-[#2d3748] text-white min-h-[120px]"
          />
        </div>

        {/* TAGS */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Tags</label>

          <div
            className="flex flex-wrap items-center gap-2 px-3 py-2 bg-[#0f1419] border border-[#2d3748] rounded-md min-h-[48px] cursor-text"
            onClick={() => document.getElementById("tagInput")?.focus()}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-600 text-sm rounded flex items-center gap-1 whitespace-nowrap"
              >
                {tag}
                <button onClick={() => removeTag(tag)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Auto-width input */}
            <input
              id="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Press Enter to add tag"
              style={{ width: inputWidth }}
              className="bg-transparent outline-none text-sm text-white"
            />

            {/* Hidden width calculator */}
            <span
              id="tag-sizer"
              className="absolute invisible whitespace-pre text-sm px-1"
            />
          </div>
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
