"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  adminService,
  Department,
  StudentProfile,
  UserAccount,
} from "@/services/adminService";
import {
  Edit3,
  GraduationCap,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [studentUsers, setStudentUsers] = useState<UserAccount[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchStudentsData = useCallback(async () => {
    try {
      setLoading(true);
      const [studentsData, usersData, departmentsData] = await Promise.all([
        adminService.getStudents(),
        adminService.getUsers(),
        adminService.getDepartments(),
      ]);

      setStudents(studentsData);
      setStudentUsers(usersData.filter((user) => user.role === "STUDENT"));
      setDepartments(departmentsData);
    } catch {
      toast.error("Failed to load students.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStudentsData();
  }, [fetchStudentsData]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const departmentId = Number(formData.get("departmentId"));
    const studentId = String(formData.get("studentId") || "").trim();
    const semester = Number(formData.get("semester"));
    const phone = String(formData.get("phone") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const dateOfBirth = String(formData.get("dateOfBirth") || "").trim();

    if (!departmentId || !studentId || !semester) {
      toast.error("Student ID, department, and semester are required.");
      return;
    }

    try {
      setSaving(true);

      if (selectedStudent) {
        const updatedStudent = await adminService.updateStudent(
          selectedStudent.id,
          {
            departmentId,
            studentId,
            semester,
            ...(phone ? { phone } : {}),
            ...(address ? { address } : {}),
            ...(dateOfBirth ? { dateOfBirth } : {}),
          }
        );

        setStudents((current) =>
          current.map((student) =>
            student.id === updatedStudent.id ? updatedStudent : student
          )
        );
        setSelectedStudent(null);
        toast.success("Student profile updated successfully.");
      } else {
        const userId = Number(formData.get("userId"));

        if (!userId) {
          toast.error("Select a student user account.");
          return;
        }

        const student = await adminService.createStudent({
          userId,
          departmentId,
          studentId,
          semester,
          ...(phone ? { phone } : {}),
          ...(address ? { address } : {}),
          ...(dateOfBirth ? { dateOfBirth } : {}),
        });

        setStudents((current) => [student, ...current]);
        toast.success("Student profile created successfully.");
      }

      form.reset();
    } catch {
      toast.error("Failed to save student. Profile or student ID may exist.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(student: StudentProfile) {
    const confirmed = window.confirm(
      `Delete profile for ${student.user.name}? The user account will remain.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await adminService.deleteStudent(student.id);
      setStudents((current) =>
        current.filter((item) => item.id !== student.id)
      );

      if (selectedStudent?.id === student.id) {
        setSelectedStudent(null);
      }

      toast.success("Student profile deleted successfully.");
    } catch {
      toast.error("Failed to delete student profile.");
    }
  }

  const availableStudentUsers = useMemo(() => {
    const profiledUserIds = new Set(students.map((student) => student.userId));
    return studentUsers.filter((user) => !profiledUserIds.has(user.id));
  }, [studentUsers, students]);

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !term ||
        student.user.name.toLowerCase().includes(term) ||
        student.user.email.toLowerCase().includes(term) ||
        student.studentId.toLowerCase().includes(term) ||
        student.department.name.toLowerCase().includes(term);

      const matchesDepartment =
        departmentFilter === "all" ||
        student.departmentId === Number(departmentFilter);

      const matchesStatus =
        statusFilter === "all" || student.user.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [departmentFilter, search, statusFilter, students]);

  const activeStudents = students.filter(
    (student) => student.user.status === "ACTIVE"
  ).length;
  const inactiveStudents = students.filter(
    (student) => student.user.status === "INACTIVE"
  ).length;

  return (
    <ProtectedRoute role="admin">
      <DashboardLayout role="admin">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Manage Students
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Create student profiles for existing student user accounts.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {students.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Total Students
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <GraduationCap className="h-8 w-8 text-emerald-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {activeStudents}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Active Students
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <GraduationCap className="h-8 w-8 text-orange-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {inactiveStudents}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Inactive Students
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
                    placeholder="Search students..."
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
                <table className="w-full min-w-[880px] text-left">
                  <thead>
                    <tr className="border-b text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                      <th className="py-4">Student</th>
                      <th>Student ID</th>
                      <th>Department</th>
                      <th>Semester</th>
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
                          Loading students...
                        </td>
                      </tr>
                    ) : filteredStudents.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-slate-500 dark:text-slate-400"
                        >
                          No students found.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => (
                        <tr
                          key={student.id}
                          className="border-b last:border-0 dark:border-slate-800"
                        >
                          <td className="py-5">
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {student.user.name}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {student.user.email}
                            </p>
                          </td>
                          <td className="text-slate-600 dark:text-slate-300">
                            {student.studentId}
                          </td>
                          <td className="text-slate-600 dark:text-slate-300">
                            {student.department.name}
                          </td>
                          <td className="text-slate-600 dark:text-slate-300">
                            {student.semester}
                          </td>
                          <td>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                student.user.status === "ACTIVE"
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {student.user.status}
                            </span>
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => setSelectedStudent(student)}
                              className="mr-2 rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Edit student"
                            >
                              <Edit3 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(student)}
                              className="rounded-xl p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                              title="Delete student"
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
                    {selectedStudent ? "Edit Student" : "Add Student"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Link details to an existing student account.
                  </p>
                </div>

                {selectedStudent ? (
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Cancel edit"
                  >
                    <X className="h-5 w-5" />
                  </button>
                ) : null}
              </div>

              <form
                key={selectedStudent?.id ?? "create"}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {selectedStudent ? (
                  <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {selectedStudent.user.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {selectedStudent.user.email}
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
                      Select student user
                    </option>
                    {availableStudentUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} - {user.email}
                      </option>
                    ))}
                  </select>
                )}

                <input
                  name="studentId"
                  placeholder="Student ID, e.g. STU-001"
                  defaultValue={selectedStudent?.studentId}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                />

                <select
                  name="departmentId"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                  defaultValue={selectedStudent?.departmentId ?? ""}
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
                  name="semester"
                  type="number"
                  min={1}
                  placeholder="Semester"
                  defaultValue={selectedStudent?.semester}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                />

                <input
                  name="phone"
                  placeholder="Phone"
                  defaultValue={selectedStudent?.phone ?? ""}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />

                <input
                  name="dateOfBirth"
                  type="date"
                  defaultValue={
                    selectedStudent?.dateOfBirth
                      ? selectedStudent.dateOfBirth.slice(0, 10)
                      : ""
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />

                <textarea
                  name="address"
                  placeholder="Address"
                  defaultValue={selectedStudent?.address ?? ""}
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />

                <button
                  type="submit"
                  disabled={
                    saving ||
                    departments.length === 0 ||
                    (!selectedStudent && availableStudentUsers.length === 0)
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
                    : selectedStudent
                      ? "Update Student"
                      : "Create Student"}
                </button>

                {departments.length === 0 && !loading ? (
                  <p className="text-sm text-amber-600">
                    Create a department before adding student profiles.
                  </p>
                ) : null}

                {availableStudentUsers.length === 0 &&
                !selectedStudent &&
                !loading ? (
                  <p className="text-sm text-amber-600">
                    Create a STUDENT user account before adding a profile.
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
