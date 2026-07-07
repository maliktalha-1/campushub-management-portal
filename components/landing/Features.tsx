"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  BookOpen,
  BellRing,
  BarChart3,
  Settings,
  MonitorSmartphone,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    title: "Secure Authentication",
    description:
      "JWT authentication, role-based access, protected routes, and email OTP verification.",
    icon: ShieldCheck,
    color: "blue",
  },
  {
    title: "Academic Management",
    description:
      "Manage courses, assignments, attendance, grading, and academic records effortlessly.",
    icon: BookOpen,
    color: "emerald",
  },
  {
    title: "Smart Communication",
    description:
      "Announcements, notifications, and updates between faculty, students, and administrators.",
    icon: BellRing,
    color: "purple",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Visualize university statistics, attendance trends, and assignment progress.",
    icon: BarChart3,
    color: "orange",
  },
  {
    title: "Administration",
    description:
      "Manage departments, faculty members, students, and course allocations with ease.",
    icon: Settings,
    color: "indigo",
  },
  {
    title: "Responsive Experience",
    description:
      "A modern interface optimized for desktop, tablet, and mobile devices.",
    icon: MonitorSmartphone,
    color: "pink",
  },
];

const colors = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    border: "hover:border-blue-500",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    border: "hover:border-emerald-500",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    border: "hover:border-purple-500",
  },
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    border: "hover:border-orange-500",
  },
  indigo: {
    bg: "bg-indigo-100",
    text: "text-indigo-600",
    border: "hover:border-indigo-500",
  },
  pink: {
    bg: "bg-pink-100",
    text: "text-pink-600",
    border: "hover:border-pink-500",
  },
};

export default function Features() {
  return (
    <section
      id="features"
      className="bg-slate-50 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Why Choose CampusHub
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Powerful Features for
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Modern Universities
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-600">
            Everything administrators, faculty members, and students need—
            beautifully organized into one powerful platform.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const style = colors[feature.color as keyof typeof colors];

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className={`group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl ${style.border}`}
              >
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${style.bg}`}
                >
                  <Icon
                    className={`h-8 w-8 ${style.text} transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}
                  />
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {feature.description}
                </p>

                <button className="mt-8 flex items-center gap-2 font-semibold text-blue-600 transition-all group-hover:gap-3">
                  Learn More
                  <ArrowRight className="h-5 w-5" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}