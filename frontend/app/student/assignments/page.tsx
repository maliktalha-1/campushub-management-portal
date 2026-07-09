"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FacultyAssignment } from "@/services/facultyService";
import { studentService } from "@/services/studentService";
import { Calendar, Download, FileText, Search } from "lucide-react";

function getAssignmentStatus(dueDate: string) {
  return new Date(dueDate) < new Date() ? "Overdue" : "Pending";
}

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<FacultyAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await studentService.getMyAssignments();
      setAssignments(data);
    } catch {
      toast.error("Failed to load assignments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAssignments();
  }, [fetchAssignments]);

  const filteredAssignments = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return assignments;
    }

    return assignments.filter((assignment) => {
      const course = assignment.courseAssignment.course;

      return (
        assignment.title.toLowerCase().includes(term) ||
        assignment.instructions.toLowerCase().includes(term) ||
        course.title.toLowerCase().includes(term) ||
        course.code.toLowerCase().includes(term)
      );
    });
  }, [assignments, search]);

  const pendingAssignments = assignments.filter(
    (assignment) => getAssignmentStatus(assignment.dueDate) === "Pending"
  ).length;
  const overdueAssignments = assignments.filter(
    (assignment) => getAssignmentStatus(assignment.dueDate) === "Overdue"
  ).length;

  return (
    <ProtectedRoute role="student">
      <DashboardLayout role="student">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              My Assignments
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Download assignments and track your pending work.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <FileText className="h-8 w-8 text-blue-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {assignments.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Total Assignments
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Calendar className="h-8 w-8 text-orange-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {pendingAssignments}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">Pending</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Calendar className="h-8 w-8 text-red-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {overdueAssignments}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">Overdue</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex max-w-md items-center rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
              <Search className="mr-3 h-5 w-5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assignments..."
                className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <th className="py-4">Assignment</th>
                    <th>Course</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th className="text-right">Attachment</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-slate-500 dark:text-slate-400"
                      >
                        Loading assignments...
                      </td>
                    </tr>
                  ) : filteredAssignments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-slate-500 dark:text-slate-400"
                      >
                        No assignments found.
                      </td>
                    </tr>
                  ) : (
                    filteredAssignments.map((assignment) => {
                      const course = assignment.courseAssignment.course;
                      const status = getAssignmentStatus(assignment.dueDate);

                      return (
                        <tr
                          key={assignment.id}
                          className="border-b last:border-0 dark:border-slate-800"
                        >
                          <td className="py-5">
                            <div className="flex items-start gap-3">
                              <FileText className="mt-1 h-5 w-5 text-blue-600" />
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                  {assignment.title}
                                </p>
                                <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                                  {assignment.instructions}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="text-slate-600 dark:text-slate-300">
                            <p>{course.title}</p>
                            <p className="text-sm text-slate-500">
                              {course.code}
                            </p>
                          </td>

                          <td className="text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                status === "Pending"
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {status}
                            </span>
                          </td>

                          <td className="text-right">
                            {assignment.attachmentUrl ? (
                              <a
                                href={assignment.attachmentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                              >
                                <Download className="h-4 w-4" />
                                Download
                              </a>
                            ) : (
                              <span className="text-sm text-slate-400">
                                No file
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
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
