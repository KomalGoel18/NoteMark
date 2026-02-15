"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { BookOpen, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ AUTO REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) router.push("/notes");
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
        rememberMe,
      });

      setToken(res.data.token, rememberMe);

      router.push("/notes");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1419] via-[#1a2332] to-[#0f1419] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-white">NoteMark</h1>
          <p className="text-gray-400 text-center">
            Your ideas and bookmarks, secured.
          </p>
        </div>

        <div className="bg-[#1a2332] border border-[#2d3748] rounded-xl p-8">

          <h2 className="text-xl font-semibold text-white mb-6">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-300">Email Address</label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-[#0f1419] border-[#2d3748] text-white h-11"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-300">Password</label>

                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 bg-[#0f1419] border-[#2d3748] text-white h-11"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* REMEMBER ME */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="stay-logged"
                checked={rememberMe}
                onCheckedChange={(val) => setRememberMe(!!val)}
              />
              <label htmlFor="stay-logged" className="text-sm text-gray-400">
                Stay logged in for 30 days
              </label>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Logging in..." : "Login to Dashboard"}
            </Button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-6 text-center text-gray-500 text-xs">
            OR CONTINUE WITH
          </div>

          {/* GOOGLE + GITHUB */}
          <div className="grid grid-cols-2 gap-4">

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`)
              }
            >
              Google
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`)
              }
            >
              Github
            </Button>
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-500">
            Register for free
          </Link>
        </p>
      </div>
    </div>
  );
}
