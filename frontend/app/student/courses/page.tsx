"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Enrollment } from "@/services/adminService";
import { studentService } from "@/services/studentService";
import {
  BookOpen,
  Building2,
  ClipboardCheck,
  Search,
  UserCog,
} from "lucide-react";

export default function StudentCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await studentService.getMyCourses();
      setEnrollments(data);
    } catch {
      toast.error("Failed to load enrolled courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCourses();
  }, [fetchCourses]);

  const filteredEnrollments = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return enrollments;
    }

    return enrollments.filter((enrollment) => {
      const course = enrollment.course;
      const facultyNames =
        course.assignments
          ?.map((assignment) => assignment.facultyProfile.user.name)
          .join(" ")
          .toLowerCase() ?? "";

      return (
        course.title.toLowerCase().includes(term) ||
        course.code.toLowerCase().includes(term) ||
        course.department.name.toLowerCase().includes(term) ||
        facultyNames.includes(term)
      );
    });
  }, [enrollments, search]);

  const totalCreditHours = enrollments.reduce(
    (total, enrollment) => total + enrollment.course.creditHours,
    0
  );

  const departmentCount = new Set(
    enrollments.map((enrollment) => enrollment.course.departmentId)
  ).size;

  return (
    <ProtectedRoute role="student">
      <DashboardLayout role="student">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              My Courses
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              View courses you are currently enrolled in.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {enrollments.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Enrolled Courses
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <ClipboardCheck className="h-8 w-8 text-emerald-600" />
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
                {departmentCount}
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
                placeholder="Search courses..."
                className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </div>

            {loading ? (
              <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                Loading enrolled courses...
              </div>
            ) : filteredEnrollments.length === 0 ? (
              <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                No enrolled courses found.
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {filteredEnrollments.map((enrollment) => {
                  const course = enrollment.course;
                  const facultyNames =
                    course.assignments
                      ?.map(
                        (assignment) => assignment.facultyProfile.user.name
                      )
                      .join(", ") || "Faculty not assigned";

                  return (
                    <div
                      key={enrollment.id}
                      className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800"
                    >
                      <BookOpen className="h-8 w-8 text-blue-600" />
                      <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                        {course.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {course.code}
                      </p>

                      <div className="mt-6 space-y-3">
                        <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <UserCog className="h-5 w-5 text-emerald-600" />
                          {facultyNames}
                        </p>
                        <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <Building2 className="h-5 w-5 text-violet-600" />
                          {course.department.name}
                        </p>
                        <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <ClipboardCheck className="h-5 w-5 text-orange-600" />
                          {course.creditHours} Credit Hours
                        </p>
                      </div>

                      <div className="mt-6 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        Enrolled{" "}
                        {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
