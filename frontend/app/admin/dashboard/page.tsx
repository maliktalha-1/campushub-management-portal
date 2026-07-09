"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { adminService } from "@/services/adminService";
import { GraduationCap, UserCog, Building2, BookOpen } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    departments: 0,
    courses: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const [students, faculty, departments, courses] = await Promise.all([
        adminService.getStudents(),
        adminService.getFaculty(),
        adminService.getDepartments(),
        adminService.getCourses(),
      ]);

      setStats({
        students: students.length,
        faculty: faculty.length,
        departments: departments.length,
        courses: courses.length,
      });
    }

    loadStats();
  }, []);

  return (
    <ProtectedRoute role="admin">
      <DashboardLayout role="admin">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Administrator Dashboard
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Manage students, faculty, departments, accounts, and statistics.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Students" value={stats.students.toString()} description="Registered students" icon={GraduationCap} color="blue" />
            <StatCard title="Faculty Members" value={stats.faculty.toString()} description="Faculty profiles" icon={UserCog} color="emerald" />
            <StatCard title="Departments" value={stats.departments.toString()} description="University departments" icon={Building2} color="violet" />
            <StatCard title="Courses" value={stats.courses.toString()} description="Available courses" icon={BookOpen} color="orange" />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}