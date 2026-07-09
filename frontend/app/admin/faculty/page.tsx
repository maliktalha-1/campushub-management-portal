"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  adminService,
  Department,
  FacultyProfile,
  UserAccount,
} from "@/services/adminService";
import {
  Edit3,
  Loader2,
  Plus,
  Search,
  Trash2,
  UserCog,
  X,
} from "lucide-react";

export default function AdminFacultyPage() {
  const [faculty, setFaculty] = useState<FacultyProfile[]>([]);
  const [facultyUsers, setFacultyUsers] = useState<UserAccount[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedFaculty, setSelectedFaculty] =
    useState<FacultyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchFacultyData = useCallback(async () => {
    try {
      setLoading(true);
      const [facultyData, usersData, departmentsData] = await Promise.all([
        adminService.getFaculty(),
        adminService.getUsers(),
        adminService.getDepartments(),
      ]);

      setFaculty(facultyData);
      setFacultyUsers(usersData.filter((user) => user.role === "FACULTY"));
      setDepartments(departmentsData);
    } catch {
      toast.error("Failed to load faculty.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFacultyData();
  }, [fetchFacultyData]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const departmentId = Number(formData.get("departmentId"));
    const facultyId = String(formData.get("facultyId") || "").trim();
    const designation = String(formData.get("designation") || "").trim();
    const qualification = String(formData.get("qualification") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const officeLocation = String(formData.get("officeLocation") || "").trim();

    if (!departmentId || !facultyId || !designation) {
      toast.error("Faculty ID, department, and designation are required.");
      return;
    }

    try {
      setSaving(true);

      if (selectedFaculty) {
        const updatedFaculty = await adminService.updateFaculty(
          selectedFaculty.id,
          {
            departmentId,
            facultyId,
            designation,
            ...(qualification ? { qualification } : {}),
            ...(phone ? { phone } : {}),
            ...(officeLocation ? { officeLocation } : {}),
          }
        );

        setFaculty((current) =>
          current.map((item) =>
            item.id === updatedFaculty.id ? updatedFaculty : item
          )
        );
        setSelectedFaculty(null);
        toast.success("Faculty profile updated successfully.");
      } else {
        const userId = Number(formData.get("userId"));

        if (!userId) {
          toast.error("Select a faculty user account.");
          return;
        }

        const newFaculty = await adminService.createFaculty({
          userId,
          departmentId,
          facultyId,
          designation,
          ...(qualification ? { qualification } : {}),
          ...(phone ? { phone } : {}),
          ...(officeLocation ? { officeLocation } : {}),
        });

        setFaculty((current) => [newFaculty, ...current]);
        toast.success("Faculty profile created successfully.");
      }

      form.reset();
    } catch {
      toast.error("Failed to save faculty. Profile or faculty ID may exist.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(facultyMember: FacultyProfile) {
    const confirmed = window.confirm(
      `Delete profile for ${facultyMember.user.name}? The user account will remain.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await adminService.deleteFaculty(facultyMember.id);
      setFaculty((current) =>
        current.filter((item) => item.id !== facultyMember.id)
      );

      if (selectedFaculty?.id === facultyMember.id) {
        setSelectedFaculty(null);
      }

      toast.success("Faculty profile deleted successfully.");
    } catch {
      toast.error("Failed to delete faculty profile.");
    }
  }

  const availableFacultyUsers = useMemo(() => {
    const profiledUserIds = new Set(faculty.map((item) => item.userId));
    return facultyUsers.filter((user) => !profiledUserIds.has(user.id));
  }, [faculty, facultyUsers]);

  const filteredFaculty = useMemo(() => {
    const term = search.trim().toLowerCase();

    return faculty.filter((item) => {
      const matchesSearch =
        !term ||
        item.user.name.toLowerCase().includes(term) ||
        item.user.email.toLowerCase().includes(term) ||
        item.facultyId.toLowerCase().includes(term) ||
        item.designation.toLowerCase().includes(term) ||
        item.department.name.toLowerCase().includes(term);

      const matchesDepartment =
        departmentFilter === "all" ||
        item.departmentId === Number(departmentFilter);

      const matchesStatus =
        statusFilter === "all" || item.user.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [departmentFilter, faculty, search, statusFilter]);

  const activeFaculty = faculty.filter(
    (item) => item.user.status === "ACTIVE"
  ).length;
  const inactiveFaculty = faculty.filter(
    (item) => item.user.status === "INACTIVE"
  ).length;

  return (
    <ProtectedRoute role="admin">
      <DashboardLayout role="admin">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Manage Faculty
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Create faculty profiles for existing faculty user accounts.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <UserCog className="h-8 w-8 text-blue-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {faculty.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Total Faculty
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <UserCog className="h-8 w-8 text-emerald-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {activeFaculty}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Active Faculty
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <UserCog className="h-8 w-8 text-orange-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {inactiveFaculty}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Inactive Faculty
              </p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center rounded-2xl border border-slate-200 px-4 py-3 lg:w-96 dark:border-slate-700">
                  <Search className="mr-3 h-5 w-5 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search faculty..."
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
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

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead>
                    <tr className="border-b text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                      <th className="py-4">Faculty Member</th>
                      <th>Faculty ID</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-slate-500 dark:text-slate-400"
                        >
                          Loading faculty...
                        </td>
                      </tr>
                    ) : filteredFaculty.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-slate-500 dark:text-slate-400"
                        >
                          No faculty found.
                        </td>
                      </tr>
                    ) : (
                      filteredFaculty.map((facultyMember) => (
                        <tr
                          key={facultyMember.id}
                          className="border-b last:border-0 dark:border-slate-800"
                        >
                          <td className="py-5">
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {facultyMember.user.name}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {facultyMember.user.email}
                            </p>
                          </td>
                          <td className="text-slate-600 dark:text-slate-300">
                            {facultyMember.facultyId}
                          </td>
                          <td className="text-slate-600 dark:text-slate-300">
                            {facultyMember.department.name}
                          </td>
                          <td className="text-slate-600 dark:text-slate-300">
                            {facultyMember.designation}
                          </td>
                          <td>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                facultyMember.user.status === "ACTIVE"
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {facultyMember.user.status}
                            </span>
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => setSelectedFaculty(facultyMember)}
                              className="mr-2 rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Edit faculty"
                            >
                              <Edit3 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(facultyMember)}
                              className="rounded-xl p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                              title="Delete faculty"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedFaculty ? "Edit Faculty" : "Add Faculty"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Link details to an existing faculty account.
                  </p>
                </div>

                {selectedFaculty ? (
                  <button
                    onClick={() => setSelectedFaculty(null)}
                    className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Cancel edit"
                  >
                    <X className="h-5 w-5" />
                  </button>
                ) : null}
              </div>

              <form
                key={selectedFaculty?.id ?? "create"}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {selectedFaculty ? (
                  <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {selectedFaculty.user.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {selectedFaculty.user.email}
                    </p>
                  </div>
                ) : (
                  <select
                    name="userId"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select faculty user
                    </option>
                    {availableFacultyUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} - {user.email}
                      </option>
                    ))}
                  </select>
                )}

                <input
                  name="facultyId"
                  placeholder="Faculty ID, e.g. FAC-001"
                  defaultValue={selectedFaculty?.facultyId}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                />

                <select
                  name="departmentId"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                  defaultValue={selectedFaculty?.departmentId ?? ""}
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

                <input
                  name="designation"
                  placeholder="Designation, e.g. Lecturer"
                  defaultValue={selectedFaculty?.designation}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                />

                <input
                  name="qualification"
                  placeholder="Qualification"
                  defaultValue={selectedFaculty?.qualification ?? ""}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />

                <input
                  name="phone"
                  placeholder="Phone"
                  defaultValue={selectedFaculty?.phone ?? ""}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />

                <input
                  name="officeLocation"
                  placeholder="Office location"
                  defaultValue={selectedFaculty?.officeLocation ?? ""}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />

                <button
                  type="submit"
                  disabled={
                    saving ||
                    departments.length === 0 ||
                    (!selectedFaculty && availableFacultyUsers.length === 0)
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
                >
                  {saving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                  {saving
                    ? "Saving..."
                    : selectedFaculty
                      ? "Update Faculty"
                      : "Create Faculty"}
                </button>

                {departments.length === 0 && !loading ? (
                  <p className="text-sm text-amber-600">
                    Create a department before adding faculty profiles.
                  </p>
                ) : null}

                {availableFacultyUsers.length === 0 &&
                !selectedFaculty &&
                !loading ? (
                  <p className="text-sm text-amber-600">
                    Create a FACULTY user account before adding a profile.
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
