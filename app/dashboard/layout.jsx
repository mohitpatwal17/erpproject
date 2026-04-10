"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      setIsReady(true);
    }
  }, [status, router]);

  if (status === "loading" || (!isReady && status !== "unauthenticated")) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium animate-pulse text-muted-foreground">
            Authenticating Session...
          </p>
        </div>
      </div>
    );
  }

  // If session is still null but status changed, we return null to avoid flicker
  if (!session) return null;

  return (
    <div className="h-full relative min-h-screen">
      {/* Sidebar - Desktop */}
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] border-r">
        <Sidebar user={session.user} />
      </div>
      
      {/* Main Content Area */}
      <main className="md:pl-72 h-full bg-muted/10 min-h-screen">
        <Navbar user={session.user} />
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
