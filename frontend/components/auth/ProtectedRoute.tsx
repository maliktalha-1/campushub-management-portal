"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";

type Role = "student" | "faculty" | "admin";

interface ProtectedRouteProps {
  role: Role;
  children: ReactNode;
}

export default function ProtectedRoute({
  role,
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated || !user) {
        router.push("/#portals");
        return;
      }

if (user.role !== role) {
  toast.error("Access denied. Redirecting to your dashboard.");

  setTimeout(() => {
    router.push(`/${user.role}/dashboard`);
  }, 1000);

  return;
}

      setChecking(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, role, router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 animate-pulse items-center justify-center rounded-3xl bg-blue-100 text-blue-600">
            <GraduationCap className="h-10 w-10" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Checking access...
          </h1>

          <p className="mt-2 text-slate-500">
            Please wait while we verify your portal.
          </p>
        </div>
      </main>
    );
  }

  return children;
}