"use client";

import { useState } from "react";
import API from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await API.post("/auth/forgot-password", { email });

      setMessage(res.data.message);
      setEmail("");

    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1419]">
      <div className="bg-[#1a2332] p-8 rounded-xl w-full max-w-md border border-[#2d3748]">

        <h2 className="text-2xl text-white font-semibold mb-6 text-center">
          Forgot Password
        </h2>

        <Input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 bg-[#0f1419] border-[#2d3748] text-white"
        />

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>

        {message && (
          <p className="text-sm text-center mt-4 text-blue-400">
            {message}
          </p>
        )}

        <p className="text-sm text-gray-400 mt-6 text-center">
          Remembered your password?{" "}
          <Link href="/" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
