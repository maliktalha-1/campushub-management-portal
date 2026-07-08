"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  Users,
  BookOpen,
  Building2,
  BarChart3,
  ShieldCheck,
  LockKeyhole,
  ChartNoAxesCombined,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-slate-50 py-24"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row">
        {/* Left Side */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            <GraduationCap className="mr-2 h-4 w-4" />
            Smart University Management Platform
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-extrabold leading-tight text-slate-900 md:text-6xl">
            Manage Your University
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              with Confidence
            </span>
          </h1>

          {/* Description */}
          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">
            CampusHub provides one centralized platform for administrators,
            faculty members and students to manage departments, courses,
            attendance, assignments and academic communication efficiently.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg">
              Choose Your Portal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button variant="outline" size="lg">
              Explore Features
            </Button>
          </div>

          {/* Highlights */}
        <div className="mt-10 flex flex-wrap gap-4">
        <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">
                 JWT Authentication
       </span>
            </div>

        <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm">
         <LockKeyhole className="h-5 w-5 text-blue-600" />
         <span className="text-sm font-medium text-slate-700">
            Role-Based Access
         </span>
            </div>

        <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm">
         <ChartNoAxesCombined className="h-5 w-5 text-blue-600" />
         <span className="text-sm font-medium text-slate-700">
            Analytics Dashboard
          </span>
            </div>
        </div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="rounded-3xl border bg-white p-8 shadow-2xl">
            <h3 className="mb-8 text-2xl font-bold text-slate-900">
              Dashboard Preview
            </h3>

            <div className="grid grid-cols-2 gap-5">
              <DashboardCard
                icon={<Users />}
                title="Students"
                value="2,540"
              />

              <DashboardCard
                icon={<GraduationCap />}
                title="Faculty"
                value="180"
              />

              <DashboardCard
                icon={<Building2 />}
                title="Departments"
                value="25"
              />

              <DashboardCard
                icon={<BarChart3 />}
                title="Attendance"
                value="96%"
              />
            </div>

            <div className="mt-8 rounded-xl bg-slate-100 p-5">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold">Latest Announcement</h4>
              </div>

              <p className="text-sm text-slate-600">
                Midterm examination schedule has been published.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DashboardCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-3 text-blue-600">{icon}</div>

      <h4 className="text-sm text-slate-500">{title}</h4>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}