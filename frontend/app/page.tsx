"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Globe } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#101822] text-white">
      <header className="sticky top-0 z-50 border-b border-[#2d3748] bg-[#101822]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="w-1/3" />

          <div className="w-1/3 flex justify-center">
            <h2 className="text-2xl font-bold tracking-tight text-blue-600">
              NoteMark
            </h2>
          </div>

          <div className="w-1/3 flex justify-end">
            <Link
              href="/login"
              className="text-sm font-semibold text-white hover:text-blue-400 transition-all duration-200"
            >
              Already a member? Login
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="px-6 py-20 lg:py-32 bg-gradient-to-b from-[#1a2332] to-[#101822]">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-extrabold sm:text-5xl leading-[1.15]">
              Organize Notes & Bookmarks in{" "}
              <span className="text-blue-600">One Secure Workspace</span>
            </h1>

            <div className="mt-10 flex justify-center gap-6">
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="mt-20 mx-auto max-w-6xl grid lg:grid-cols-2 gap-6">
            {/* Notes Preview */}
            <div className="rounded-xl border border-[#2d3748] bg-[#1c2431] p-4">
              <Image
                src="/notes-preview.png"
                alt="Notes Preview"
                width={1200}
                height={800}
                className="rounded-lg w-full h-auto transition-transform duration-300 hover:scale-[1.02]"
              />
              <p className="mt-4 text-center text-sm text-gray-400">
                Advanced Notes Editor
              </p>
            </div>

            {/* Bookmarks Preview */}
            <div className="rounded-xl border border-[#2d3748] bg-[#1c2431] p-4">
              <Image
                src="/bookmarks-preview.png"
                alt="Bookmarks Preview"
                width={1200}
                height={800}
                className="rounded-lg w-full h-auto transition-transform duration-300 hover:scale-[1.02]"
              />
              <p className="mt-4 text-center text-sm text-gray-400">
                Intuitive Bookmark Management
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="mx-auto max-w-7xl grid md:grid-cols-4 gap-8">
            {[
              "Structured Note Organization",
              "Intelligent Link Curation",
              "Priority-Based Access",
              "Multi-Layer Authentication",
            ].map((feature) => (
              <div
                key={feature}
                className="rounded-xl border border-[#2d3748] bg-[#1c2431] p-8 min-h-[180px] flex items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40"
              >
                <h3 className="text-lg font-semibold leading-snug max-w-[180px]">
                  {feature}
                </h3>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-[#2d3748] py-16">
          <div className="mx-auto max-w-7xl px-6 flex flex-col items-center gap-4">
            <p className="text-2xl font-bold tracking-tight text-white">
              Created with ❤️ by Komal Goel
            </p>

            <div className="flex items-center gap-5">
              <a
                href="https://github.com/KomalGoel18"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white hover:-translate-y-0.5 transition-all duration-200"
              >
                <Github size={22} />
              </a>

              <a
                href="https://www.linkedin.com/in/komal-goel-b9bb4a291/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white hover:-translate-y-0.5 transition-all duration-200"
              >
                <Linkedin size={22} />
              </a>

              <a
                href="https://komalgoel.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white hover:-translate-y-0.5 transition-all duration-200"
              >
                <Globe size={22} />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}