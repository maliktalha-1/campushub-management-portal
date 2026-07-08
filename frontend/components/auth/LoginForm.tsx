"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Role = "student" | "faculty" | "admin";

interface LoginFormProps {
  role: Role;
}

const roleLabels = {
  student: "Student",
  faculty: "Faculty",
  admin: "Administrator",
};

export default function LoginForm({ role }: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  localStorage.setItem(
    "pendingUser",
    JSON.stringify({
      name: roleLabels[role],
      email: `${role}@campushub.edu`,
      role,
    })
  );

  toast.success("Credentials verified.");

  router.push(`/verify-otp?role=${role}`);
}

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl bg-blue-50 p-4 text-sm font-medium text-blue-700">
        Continue as {roleLabels[role]}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Email Address
        </label>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-blue-500">
          <Mail className="h-5 w-5 text-slate-400" />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full bg-transparent outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Password
        </label>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-blue-500">
          <Lock className="h-5 w-5 text-slate-400" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full bg-transparent outline-none"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 hover:text-slate-700"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-600">
          <input type="checkbox" className="h-4 w-4" />
          Remember me
        </label>

        <Link href="/forgot-password" className="font-semibold text-blue-600">
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center rounded-2xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700"
      >
        Login
        <ArrowRight className="ml-2 h-5 w-5" />
      </button>

     {role === "admin" ? (
    <p className="text-center text-sm text-slate-600">
        Only authorized university administrators can access this portal.
     </p>
) : (
    <p className="text-center text-sm text-slate-600">
      Account not created yet? Please contact the administrator.
    </p>
)}
    </form>
  );
}