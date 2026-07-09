"use client";

import {
  GraduationCap,
  ShieldCheck,
  MailCheck,
  LayoutDashboard,
} from "lucide-react";
import { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-14 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">
                <GraduationCap className="h-8 w-8" />
              </div>

              <div>
                <h1 className="text-3xl font-bold">CampusHub</h1>
                <p className="text-blue-100">
                  University Management Portal
                </p>
              </div>
            </div>

            <h2 className="mt-16 text-5xl font-bold leading-tight">
              Welcome Back.
            </h2>

            <p className="mt-6 max-w-md text-lg leading-8 text-blue-100">
              One secure platform for students, faculty members and
              administrators.
            </p>
          </div>

          <div className="space-y-6">
            <Feature icon={<ShieldCheck />} text="Secure JWT Authentication" />
            <Feature icon={<MailCheck />} text="Email OTP Verification" />
            <Feature
              icon={<LayoutDashboard />}
              text="Modern Responsive Dashboard"
            />
          </div>
        </div>

        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
              {title}
            </h2>

            <p className="mt-3 text-slate-600 dark:text-slate-300">
              {subtitle}
            </p>

            <div className="mt-10">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur">
      <div className="text-white">{icon}</div>
      <span className="font-medium">{text}</span>
    </div>
  );
}