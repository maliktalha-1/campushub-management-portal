"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CourseAssignment } from "@/services/adminService";
import { facultyService } from "@/services/facultyService";
import {
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardCheck,
  Search,
} from "lucide-react";

export default function FacultyCoursesPage() {
  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAssignedCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await facultyService.getMyAssignedCourses();
      setAssignments(data);
    } catch {
      toast.error("Failed to load assigned courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAssignedCourses();
  }, [fetchAssignedCourses]);

  const filteredAssignments = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return assignments;
    }

    return assignments.filter((assignment) => {
      return (
        assignment.course.title.toLowerCase().includes(term) ||
        assignment.course.code.toLowerCase().includes(term) ||
        assignment.course.department.name.toLowerCase().includes(term) ||
        assignment.semester.toLowerCase().includes(term)
      );
    });
  }, [assignments, search]);

  const totalCreditHours = assignments.reduce(
    (total, assignment) => total + assignment.course.creditHours,
    0
  );

  return (
    <ProtectedRoute role="faculty">
      <DashboardLayout role="faculty">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Assigned Courses
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              View and manage your assigned courses.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <BookOpen className="h-8 w-8 text-emerald-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {assignments.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Assigned Courses
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <ClipboardCheck className="h-8 w-8 text-blue-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {totalCreditHours}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Credit Hours
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Building2 className="h-8 w-8 text-violet-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {new Set(assignments.map((item) => item.course.departmentId))
                  .size}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Departments
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex max-w-md items-center rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
              <Search className="mr-3 h-5 w-5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assigned courses..."
                className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </div>

            {loading ? (
              <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                Loading assigned courses...
              </div>
            ) : filteredAssignments.length === 0 ? (
              <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                No assigned courses found.
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {filteredAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800"
                  >
                    <BookOpen className="h-8 w-8 text-emerald-600" />
                    <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                      {assignment.course.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {assignment.course.code}
                    </p>

                    <div className="mt-6 space-y-3">
                      <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        {assignment.course.department.name}
                      </p>
                      <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <ClipboardCheck className="h-5 w-5 text-orange-600" />
                        {assignment.course.creditHours} Credit Hours
                      </p>
                      <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <CalendarDays className="h-5 w-5 text-violet-600" />
                        {assignment.semester}
                      </p>
                    </div>

                    <button className="mt-6 w-full rounded-2xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700">
                      View Course
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
