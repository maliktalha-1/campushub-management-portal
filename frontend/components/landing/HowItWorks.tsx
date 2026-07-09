"use client";

import { motion } from "framer-motion";
import {
  Users,
  ShieldCheck,
  LayoutDashboard,
  ChartNoAxesCombined,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose Your Role",
    description:
      "Select whether you're a Student, Faculty Member, or Administrator to access your dedicated portal.",
    icon: Users,
  },
  {
    number: "02",
    title: "Secure Login",
    description:
      "Sign in using your credentials with secure JWT authentication and email OTP verification.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Manage Your Tasks",
    description:
      "Access courses, assignments, attendance, announcements, and everything you need from one dashboard.",
    icon: LayoutDashboard,
  },
  {
    number: "04",
    title: "Track Progress",
    description:
      "Monitor attendance, assignments, analytics, and academic performance in real time.",
    icon: ChartNoAxesCombined,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-white dark:bg-slate-900 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Simple Workflow
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white">
            How CampusHub
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Works
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
            From login to managing your university, CampusHub keeps every
            academic activity organized in just a few simple steps.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="grid gap-8 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                viewport={{ once: true }}
                className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl"
              >
                {/* Number */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
                  {step.description}
                </p>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <ArrowRight className="absolute -right-5 top-1/2 hidden h-8 w-8 -translate-y-1/2 text-blue-300 lg:block" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}