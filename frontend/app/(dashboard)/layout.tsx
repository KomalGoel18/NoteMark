"use client";

import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f1419] flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
