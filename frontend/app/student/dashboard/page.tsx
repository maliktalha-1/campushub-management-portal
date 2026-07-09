"use client";

import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { studentService } from "@/services/studentService";
import { BookOpen, ClipboardCheck, UserCheck, Bell } from "lucide-react";

export default function StudentDashboardPage() {
  const [stats, setStats] = useState({
    courses: 0,
    assignments: 0,
    attendance: "0%",
    announcements: 0,
  });

  const loadStats = useCallback(async () => {
    try {
      const [courses, assignments, attendance, announcements] =
        await Promise.all([
          studentService.getMyCourses(),
          studentService.getMyAssignments(),
          studentService.getMyAttendance(),
          studentService.getMyAnnouncements(),
        ]);

   const totalRecords = attendance.length;

      const presentRecords = attendance.filter(
      (record) => record.status === "PRESENT"
        ).length;

       const attendancePercentage =
         totalRecords > 0
         ? `${Math.round((presentRecords / totalRecords) * 100)}%`
        : "0%";


      setStats({
        courses: courses.length,
        assignments: assignments.length,
        attendance: attendancePercentage,
        announcements: announcements.length,
      });
    } catch {
      // keep default stats
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <ProtectedRoute role="student">
      <DashboardLayout role="student">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Student Dashboard
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              View your courses, assignments, attendance, and announcements.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Enrolled Courses" value={String(stats.courses)} description="Your active courses" icon={BookOpen} color="blue" />
            <StatCard title="Assignments" value={String(stats.assignments)} description="Available assignments" icon={ClipboardCheck} color="orange" />
            <StatCard title="Attendance" value={stats.attendance} description="Your attendance percentage" icon={UserCheck} color="emerald" />
            <StatCard title="Announcements" value={String(stats.announcements)} description="Course announcements" icon={Bell} color="violet" />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}