"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";

type Role = "student" | "faculty" | "admin";

interface LoginFormProps {
  role: Role;
}

const roleLabels = {
  student: "Student",
  faculty: "Faculty",
  admin: "Administrator",
};

const dashboardRoutes = {
  student: "/student/dashboard",
  faculty: "/faculty/dashboard",
  admin: "/admin/dashboard",
};

export default function LoginForm({ role }: LoginFormProps) {
const router = useRouter();
const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      setLoading(true);

      const data = await authService.login({
        email,
        password,
      });

      const backendRole = data.user.role.toLowerCase();

      if (backendRole !== role) {
        toast.error(`Please login from the ${backendRole} portal.`);
        return;
      }
      localStorage.setItem("campushub_token", data.access_token);

       dispatch(login(data.user));

      localStorage.setItem(
        "campushub_user",
       JSON.stringify(data.user)
);
      toast.success("Login successful.");

      router.push(dashboardRoutes[role]);
    } catch {
      toast.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl bg-blue-50 p-4 text-sm font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
        Continue as {roleLabels[role]}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Email Address
        </label>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-blue-500 dark:border-slate-700">
          <Mail className="h-5 w-5 text-slate-400" />
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Password
        </label>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-blue-500 dark:border-slate-700">
          <Lock className="h-5 w-5 text-slate-400" />

          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <input type="checkbox" className="h-4 w-4" />
          Remember me
        </label>

        <Link href="/forgot-password" className="font-semibold text-blue-600">
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-2xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Logging in..." : "Login"}
        {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
      </button>

      {role === "admin" ? (
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Only authorized university administrators can access this portal.
        </p>
      ) : (
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Account not created yet? Please contact the administrator.
        </p>
      )}
    </form>
  );
}