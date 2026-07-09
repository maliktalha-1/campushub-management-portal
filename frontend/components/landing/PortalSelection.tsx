"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  UserCog,
  Shield,
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Bell,
  Users,
  Building2,
  BarChart3,
} from "lucide-react";

const portals = [
  {
    title: "Student",
    subtitle: "Access your academic journey",
    icon: GraduationCap,
    color: "blue",
    features: [
      { icon: BookOpen, text: "Courses" },
      { icon: ClipboardCheck, text: "Assignments" },
      { icon: Bell, text: "Announcements" },
    ],
    loginHref: "/student/login",
  },
  {
    title: "Faculty",
    subtitle: "Manage teaching activities",
    icon: UserCog,
    color: "emerald",
    features: [
      { icon: BookOpen, text: "Manage Courses" },
      { icon: ClipboardCheck, text: "Attendance" },
      { icon: Bell, text: "Announcements" },
    ],
    loginHref: "/faculty/login",
  },
  {
    title: "Administrator",
    subtitle: "Complete university control",
    icon: Shield,
    color: "violet",
    features: [
      { icon: Users, text: "Students" },
      { icon: Building2, text: "Departments" },
      { icon: BarChart3, text: "Analytics" },
    ],
    loginHref: "/admin/login",
  },
];

const colors = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    hover: "hover:border-blue-500",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    hover: "hover:border-emerald-500",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
  violet: {
    bg: "bg-violet-100",
    text: "text-violet-600",
    hover: "hover:border-violet-500",
    button: "bg-violet-600 hover:bg-violet-700",
  },
};

export default function PortalSelection() {
  return (
    <section id="portals" className="bg-slate-50 dark:bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Choose Your Portal
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white">
            One Platform,
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Three Experiences
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
            Select your role to access a personalized dashboard designed for
            your responsibilities.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {portals.map((portal, index) => {
            const style = colors[portal.color as keyof typeof colors];
            const Icon = portal.icon;

            return (
              <motion.div
                key={portal.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className={`rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm transition-all duration-300 hover:shadow-2xl ${style.hover}`}
              >
                <div
                  className={`mb-6 flex h-20 w-20 items-center justify-center rounded-3xl ${style.bg}`}
                >
                  <Icon className={`h-10 w-10 ${style.text}`} />
                </div>

                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {portal.title}
                </h3>

                <p className="mt-2 text-slate-600 dark:text-slate-300">{portal.subtitle}</p>

                <div className="mt-8 space-y-4">
                  {portal.features.map((feature) => {
                    const FeatureIcon = feature.icon;

                    return (
                      <div key={feature.text} className="flex items-center gap-3">
                        <FeatureIcon className={`h-5 w-5 ${style.text}`} />
                        <span className="text-slate-700">{feature.text}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10 space-y-3">
                  <Link
                    href={portal.loginHref}
                    className={`flex w-full items-center justify-center rounded-2xl px-5 py-3 font-semibold text-white transition ${style.button}`}
                  >
                    Login
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>


                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}