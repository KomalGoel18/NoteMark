"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await API.post(`/auth/reset-password/${token}`, {
        password
      });

      setMessage(res.data.message);

      setTimeout(() => {
        router.push("/");
      }, 2000);

    } catch (err: any) {
      setMessage(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1419]">
      <div className="bg-[#1a2332] p-8 rounded-xl w-full max-w-md border border-[#2d3748]">

        <h2 className="text-2xl text-white font-semibold mb-6 text-center">
          Reset Password
        </h2>

        <Input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 bg-[#0f1419] border-[#2d3748] text-white"
        />

        <Button
          onClick={handleReset}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>

        {message && (
          <p className="text-sm text-center mt-4 text-blue-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
