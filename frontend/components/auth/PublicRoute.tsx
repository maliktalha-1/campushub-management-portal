"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { GraduationCap } from "lucide-react";

export default function PublicRoute({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated && user?.role) {
        router.push(`/${user.role}/dashboard`);
        return;
      }

      setChecking(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 animate-pulse items-center justify-center rounded-3xl bg-blue-100 text-blue-600">
            <GraduationCap className="h-10 w-10" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Loading CampusHub...
          </h1>
        </div>
      </main>
    );
  }

  return children;
}