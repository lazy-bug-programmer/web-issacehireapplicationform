import type React from "react";
import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky px-4 top-0 z-10 border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between py-4">
          <AdminNav />
        </div>
      </header>
      <main className="flex-1 container mx-auto py-8 px-4">{children}</main>
    </div>
  );
}
