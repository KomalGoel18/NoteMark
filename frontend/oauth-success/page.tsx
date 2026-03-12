"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function OAuthSuccess() {
  const params = useSearchParams();
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      setToken(token, false);
      router.push("/notes");
    }
  }, []);

  return <p>Logging you in...</p>;
}