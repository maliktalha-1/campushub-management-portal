"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { GraduationCap, LogOut, LayoutDashboard } from "lucide-react";

export default function PublicRoute({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setChecking(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  function handleSwitchAccount() {
    dispatch(logout());
    localStorage.clear();
    window.location.reload();
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 animate-pulse items-center justify-center rounded-3xl bg-blue-100 text-blue-600">
            <GraduationCap className="h-10 w-10" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
            Loading CampusHub...
          </h1>
        </div>
      </main>
    );
  }

  if (isAuthenticated && user?.role) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-blue-600">
            <GraduationCap className="h-10 w-10" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
            Already Logged In
          </h1>

          <p className="mt-3 text-slate-600 dark:text-slate-300">
            You are logged in as {user.name}.
          </p>

          <div className="mt-8 space-y-3">
            <button
              onClick={() => router.push(`/${user.role}/dashboard`)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white"
            >
              <LayoutDashboard className="h-5 w-5" />
              Go to Dashboard
            </button>

            <button
              onClick={handleSwitchAccount}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <LogOut className="h-5 w-5" />
              Logout and Switch Account
            </button>
          </div>
        </div>
      </main>
    );
  }

  return children;
}