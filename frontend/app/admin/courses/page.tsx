"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminService, Course, Department } from "@/services/adminService";
import {
  BookOpen,
  Building2,
  GraduationCap,
  Loader2,
  Plus,
  Search,
} from "lucide-react";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const fetchCoursesData = useCallback(async () => {
    try {
      setLoading(true);
      const [coursesData, departmentsData] = await Promise.all([
        adminService.getCourses(),
        adminService.getDepartments(),
      ]);
      setCourses(coursesData);
      setDepartments(departmentsData);
    } catch {
      toast.error("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCoursesData();
  }, [fetchCoursesData]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const code = String(formData.get("code") || "").trim().toUpperCase();
    const title = String(formData.get("title") || "").trim();
    const creditHours = Number(formData.get("creditHours"));
    const departmentId = Number(formData.get("departmentId"));

    if (!code || !title || !creditHours || !departmentId) {
      toast.error("All course fields are required.");
      return;
    }

    try {
      setCreating(true);
      const course = await adminService.createCourse({
        code,
        title,
        creditHours,
        departmentId,
      });
      setCourses((current) => [course, ...current]);
      toast.success("Course created successfully.");
      form.reset();
    } catch {
      toast.error("Failed to create course. Code may already exist.");
    } finally {
      setCreating(false);
    }
  }

  const filteredCourses = useMemo(() => {
    const term = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !term ||
        course.title.toLowerCase().includes(term) ||
        course.code.toLowerCase().includes(term) ||
        course.department.name.toLowerCase().includes(term);

      const matchesDepartment =
        departmentFilter === "all" ||
        course.departmentId === Number(departmentFilter);

      return matchesSearch && matchesDepartment;
    });
  }, [courses, departmentFilter, search]);

  const totalCreditHours = courses.reduce(
    (total, course) => total + course.creditHours,
    0
  );

  return (
    <ProtectedRoute role="admin">
      <DashboardLayout role="admin">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Manage Courses
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Create courses, assign departments, and monitor course activity.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {courses.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Total Courses
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Building2 className="h-8 w-8 text-emerald-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {departments.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Departments
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <GraduationCap className="h-8 w-8 text-violet-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {totalCreditHours}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Total Credit Hours
              </p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center rounded-2xl border border-slate-200 px-4 py-3 lg:w-96 dark:border-slate-700">
                  <Search className="mr-3 h-5 w-5 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                  />
                </div>

                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="all">All Departments</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead>
                    <tr className="border-b text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                      <th className="py-4">Course</th>
                      <th>Department</th>
                      <th>Credit Hours</th>
                      <th>Created</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-8 text-center text-slate-500 dark:text-slate-400"
                        >
                          Loading courses...
                        </td>
                      </tr>
                    ) : filteredCourses.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-8 text-center text-slate-500 dark:text-slate-400"
                        >
                          No courses found.
                        </td>
                      </tr>
                    ) : (
                      filteredCourses.map((course) => (
                        <tr
                          key={course.id}
                          className="border-b last:border-0 dark:border-slate-800"
                        >
                          <td className="py-5">
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {course.title}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {course.code}
                            </p>
                          </td>
                          <td className="text-slate-600 dark:text-slate-300">
                            {course.department.name}
                          </td>
                          <td className="text-slate-600 dark:text-slate-300">
                            {course.creditHours}
                          </td>
                          <td className="text-slate-600 dark:text-slate-300">
                            {new Date(course.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Add Course
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Courses must belong to an existing department.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="title"
                  placeholder="Course title"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                />

                <input
                  name="code"
                  placeholder="Code, e.g. CS-301"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 uppercase text-slate-900 outline-none placeholder:normal-case placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                />

                <input
                  name="creditHours"
                  type="number"
                  min={1}
                  placeholder="Credit hours"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                />

                <select
                  name="departmentId"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select department
                  </option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={creating || departments.length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
                >
                  {creating ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                  {creating ? "Creating..." : "Create Course"}
                </button>

                {departments.length === 0 && !loading ? (
                  <p className="text-sm text-amber-600">
                    Create a department before adding courses.
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
