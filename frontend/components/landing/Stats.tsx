"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Users,
  Building2,
  ChartNoAxesCombined,
} from "lucide-react";

const stats = [
  {
    icon: GraduationCap,
    number: 2500,
    suffix: "+",
    title: "Students",
    description: "Managing academic records efficiently.",
  },
  {
    icon: Users,
    number: 180,
    suffix: "+",
    title: "Faculty Members",
    description: "Empowering educators with smart tools.",
  },
  {
    icon: Building2,
    number: 25,
    suffix: "+",
    title: "Departments",
    description: "Organized departments under one platform.",
  },
  {
    icon: ChartNoAxesCombined,
    number: 96,
    suffix: "%",
    title: "Attendance",
    description: "Accurate attendance tracking in real time.",
  },
];

export default function Stats() {
  return (
    <section
      id="stats"
      className="bg-white dark:bg-slate-900 py-24"
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
            CampusHub at a Glance
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white">
            Everything You Need to Manage
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Your University
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
            A centralized platform designed to simplify administration,
            improve communication, and enhance the academic experience.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                }}
                className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm transition-all hover:border-blue-500 hover:shadow-xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 transition-all group-hover:bg-blue-600">
                  <Icon className="h-8 w-8 text-blue-600 group-hover:text-white" />
                </div>

                <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
                  <CountUp
                    end={stat.number}
                    duration={2}
                  />
                  {stat.suffix}
                </h3>

                <p className="mt-2 text-lg font-semibold text-slate-800">
                  {stat.title}
                </p>

                <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}