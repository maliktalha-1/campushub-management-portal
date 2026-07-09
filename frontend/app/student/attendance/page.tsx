"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { StudentAttendanceRecord, studentService } from "@/services/studentService";
import { CalendarCheck, CalendarX, Clock, UserCheck } from "lucide-react";

function calculatePercentage(present: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((present / total) * 100);
}

export default function StudentAttendancePage() {
  const [records, setRecords] = useState<StudentAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const data = await studentService.getMyAttendance();
      setRecords(data);
    } catch {
      toast.error("Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAttendance();
  }, [fetchAttendance]);

  const presentCount = records.filter(
    (record) => record.status === "PRESENT" || record.status === "LATE"
  ).length;
  const absentCount = records.filter((record) => record.status === "ABSENT")
    .length;
  const overallPercentage = calculatePercentage(presentCount, records.length);

  const courseSummaries = useMemo(() => {
    const summaries = new Map<
      number,
      {
        course: string;
        code: string;
        present: number;
        absent: number;
        total: number;
      }
    >();

    records.forEach((record) => {
      const course = record.courseAssignment.course;
      const summary = summaries.get(course.id) ?? {
        course: course.title,
        code: course.code,
        present: 0,
        absent: 0,
        total: 0,
      };

      summary.total += 1;

      if (record.status === "ABSENT") {
        summary.absent += 1;
      } else {
        summary.present += 1;
      }

      summaries.set(course.id, summary);
    });

    return Array.from(summaries.values());
  }, [records]);

  return (
    <ProtectedRoute role="student">
      <DashboardLayout role="student">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Attendance Records
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Track your attendance percentage across all courses.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <StatCard
              title="Overall Attendance"
              value={`${overallPercentage}%`}
              description="Across marked classes"
              icon={UserCheck}
              color="blue"
            />
            <StatCard
              title="Present Classes"
              value={String(presentCount)}
              description="Present and late combined"
              icon={CalendarCheck}
              color="emerald"
            />
            <StatCard
              title="Absent Classes"
              value={String(absentCount)}
              description="Total missed classes"
              icon={CalendarX}
              color="orange"
            />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Course-wise Attendance
            </h2>

            {loading ? (
              <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                Loading attendance...
              </div>
            ) : courseSummaries.length === 0 ? (
              <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                No attendance records found.
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                {courseSummaries.map((item) => {
                  const percentage = calculatePercentage(
                    item.present,
                    item.total
                  );

                  return (
                    <div
                      key={item.code}
                      className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
                    >
                      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {item.course}
                          </h3>
                          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Clock className="h-4 w-4" />
                            {item.code} - Present {item.present} / Absent{" "}
                            {item.absent}
                          </p>
                        </div>

                        <span className="text-2xl font-bold text-blue-600">
                          {percentage}%
                        </span>
                      </div>

                      <div className="mt-4 h-3 rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                          className="h-3 rounded-full bg-blue-600"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Recent Records
            </h2>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <th className="py-4">Course</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-slate-500 dark:text-slate-400"
                      >
                        Loading records...
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-slate-500 dark:text-slate-400"
                      >
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b last:border-0 dark:border-slate-800"
                      >
                        <td className="py-5 text-slate-700 dark:text-slate-300">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {record.courseAssignment.course.title}
                          </p>
                          <p className="text-sm text-slate-500">
                            {record.courseAssignment.course.code}
                          </p>
                        </td>
                        <td className="text-slate-600 dark:text-slate-300">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              record.status === "PRESENT"
                                ? "bg-emerald-100 text-emerald-600"
                                : record.status === "LATE"
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-red-100 text-red-600"
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="text-slate-600 dark:text-slate-300">
                          {record.remarks || "No remarks"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
