"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminService, Department } from "@/services/adminService";
import {
  BookOpen,
  Building2,
  Loader2,
  Plus,
  Search,
} from "lucide-react";

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getDepartments();
      setDepartments(data);
    } catch {
      toast.error("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDepartments();
  }, [fetchDepartments]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const code = String(formData.get("code") || "").trim().toUpperCase();

    if (!name || !code) {
      toast.error("Department name and code are required.");
      return;
    }

    try {
      setCreating(true);
      const department = await adminService.createDepartment({ name, code });
      setDepartments((current) => [department, ...current]);
      toast.success("Department created successfully.");
      form.reset();
    } catch {
      toast.error("Failed to create department. Name or code may already exist.");
    } finally {
      setCreating(false);
    }
  }

  const filteredDepartments = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return departments;
    }

    return departments.filter((department) => {
      return (
        department.name.toLowerCase().includes(term) ||
        department.code.toLowerCase().includes(term)
      );
    });
  }, [departments, search]);

  const totalCourses = departments.reduce(
  (total, department) => total + (department.courses?.length ?? 0),
  0
);

  return (
    <ProtectedRoute role="admin">
      <DashboardLayout role="admin">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Manage Departments
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Create and monitor university departments.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {departments.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Total Departments
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <BookOpen className="h-8 w-8 text-violet-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {totalCourses}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Department Courses
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex max-w-md items-center rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                <Search className="mr-3 h-5 w-5 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search department..."
                  className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left">
                  <thead>
                    <tr className="border-b text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                      <th className="py-4">Department</th>
                      <th>Code</th>
                      <th>Courses</th>
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
                          Loading departments...
                        </td>
                      </tr>
                    ) : filteredDepartments.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-8 text-center text-slate-500 dark:text-slate-400"
                        >
                          No departments found.
                        </td>
                      </tr>
                    ) : (
                      filteredDepartments.map((department) => (
                        <tr
                          key={department.id}
                          className="border-b last:border-0 dark:border-slate-800"
                        >
                          <td className="py-5 font-semibold text-slate-900 dark:text-white">
                            {department.name}
                          </td>
                          <td className="text-slate-600 dark:text-slate-300">
                            {department.code}
                          </td>
                          <td className="text-slate-600 dark:text-slate-300">
                             {department.courses?.length ?? 0}                          </td>
                          <td className="text-slate-600 dark:text-slate-300">
                            {new Date(department.createdAt).toLocaleDateString()}
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
                  Add Department
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Department codes should be short and unique.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="name"
                  placeholder="Department name"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                />

                <input
                  name="code"
                  placeholder="Code, e.g. CS"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 uppercase text-slate-900 outline-none placeholder:normal-case placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                />

                <button
                  type="submit"
                  disabled={creating}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
                >
                  {creating ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                  {creating ? "Creating..." : "Create Department"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
