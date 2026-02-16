'use client';

import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export default function RegisterPage() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      setToken(res.data.token, false);
      router.push("/notes");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    alert("Google signup not implemented");
  };

  const handleAppleClick = () => {
    alert("Apple signup not implemented");
  };

  return (
    <div className="min-h-screen bg-[#0f1419] flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-white mb-3">
            Create your NoteMark account
          </h1>
          <p className="text-gray-400">
            Start organizing your notes and bookmarks today.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <Input
                type="text"
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 bg-[#1a2332] border-[#2d3748] text-white placeholder:text-gray-500 h-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              <Input
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-[#1a2332] border-[#2d3748] text-white placeholder:text-gray-500 h-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-[#1a2332] border-[#2d3748] text-white placeholder:text-gray-500 h-12"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-gray-500 rounded-full"></span>
              Must be at least 8 characters long
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox id="terms" className="mt-1 border-gray-600" />
            <label htmlFor="terms" className="text-sm text-gray-400">
              By registering, you agree to our{' '}
              <Link href="#" className="text-blue-500 hover:text-blue-400">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-blue-500 hover:text-blue-400">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {loading ? "Creating..." : "Create Account →"}
          </Button>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0f1419] px-4 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              onClick={handleGoogleClick}
              variant="outline"
              className="h-12 bg-[#1a2332] border-[#2d3748] hover:bg-[#2d3748] text-white"
            >
              <span className="mr-2">G</span>
              Google
            </Button>

            <Button
              type="button"
              onClick={handleAppleClick}
              variant="outline"
              className="h-12 bg-[#1a2332] border-[#2d3748] hover:bg-[#2d3748] text-white"
            >
              <span className="mr-2"></span>
              Apple
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <Link href="/" className="text-blue-500 hover:text-blue-400 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
