"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  UserRoundCog,
} from "lucide-react";
import { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const roleFromUrl = searchParams.get("role") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(roleFromUrl);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(`/verify-otp?mode=register&role=${role}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Full Name
        </label>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-blue-500">
          <User className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full bg-transparent outline-none"
            required
          />
        </div>
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
          Select Role
        </label>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-blue-500">
          <UserRoundCog className="h-5 w-5 text-slate-400" />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-transparent outline-none"
            required
          >
            <option value="" disabled>
              Choose your role
            </option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Administrator</option>
          </select>
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
            placeholder="Create a password"
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

      <button
        type="submit"
        className="flex w-full items-center justify-center rounded-2xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700"
      >
        Create Account
        <ArrowRight className="ml-2 h-5 w-5" />
      </button>

      <p className="text-center text-sm text-slate-600">
      New credentials will be shared with the assigned user.
      </p>
    </form>
  );
}
