"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  adminService,
  Course,
  Enrollment,
  StudentProfile,
} from "@/services/adminService";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Loader2,
  Search,
  Trash2,
  UserCheck,
} from "lucide-react";

export default function EnrollStudentsPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const fetchEnrollmentData = useCallback(async () => {
    try {
      setLoading(true);
      const [studentsData, coursesData, enrollmentsData] = await Promise.all([
        adminService.getStudents(),
        adminService.getCourses(),
        adminService.getEnrollments(),
      ]);

      setStudents(studentsData);
      setCourses(coursesData);
      setEnrollments(enrollmentsData);
    } catch {
      toast.error("Failed to load enrollment data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEnrollmentData();
  }, [fetchEnrollmentData]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const studentProfileId = Number(formData.get("studentProfileId"));
    const courseId = Number(formData.get("courseId"));

    if (!studentProfileId || !courseId) {
      toast.error("Student and course are required.");
      return;
    }

    try {
      setSaving(true);
      const enrollment = await adminService.enrollStudent({
        studentProfileId,
        courseId,
      });

      setEnrollments((current) => [enrollment, ...current]);
      toast.success("Student enrolled successfully.");
      form.reset();
    } catch {
      toast.error("Failed to enroll student. This enrollment may already exist.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(enrollment: Enrollment) {
    const confirmed = window.confirm(
      `Remove ${enrollment.studentProfile.user.name} from ${enrollment.course.title}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await adminService.deleteEnrollment(enrollment.id);
      setEnrollments((current) =>
        current.filter((item) => item.id !== enrollment.id)
      );
      toast.success("Enrollment removed successfully.");
    } catch {
      toast.error("Failed to remove enrollment.");
    }
  }

  const filteredEnrollments = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return enrollments;
    }

    return enrollments.filter((enrollment) => {
      const student = enrollment.studentProfile;
      const course = enrollment.course;

      return (
        student.user.name.toLowerCase().includes(term) ||
        student.studentId.toLowerCase().includes(term) ||
        student.department.name.toLowerCase().includes(term) ||
        course.title.toLowerCase().includes(term) ||
        course.code.toLowerCase().includes(term) ||
        course.department.name.toLowerCase().includes(term)
      );
    });
  }, [enrollments, search]);

  return (
    <ProtectedRoute role="admin">
      <DashboardLayout role="admin">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Enroll Students
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Enroll student profiles into specific courses and manage active
              course access.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {students.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">Students</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <BookOpen className="h-8 w-8 text-emerald-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {courses.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">Courses</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <UserCheck className="h-8 w-8 text-violet-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {enrollments.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">Enrollments</p>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                New Enrollment
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Link one student profile to one course.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Select Student
                  </label>
                  <select
                    name="studentProfileId"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select student
                    </option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.user.name} - {student.studentId}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Select Course
                  </label>
                  <select
                    name="courseId"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select course
                    </option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={saving || students.length === 0 || courses.length === 0}
                  className="flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
                >
                  {saving ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : null}
                  {saving ? "Enrolling..." : "Enroll Student"}
                  {!saving ? <ArrowRight className="ml-2 h-5 w-5" /> : null}
                </button>

                {students.length === 0 && !loading ? (
                  <p className="text-sm text-amber-600">
                    Create at least one student profile before enrolling.
                  </p>
                ) : null}

                {courses.length === 0 && !loading ? (
                  <p className="text-sm text-amber-600">
                    Create at least one course before enrolling students.
                  </p>
                ) : null}
              </form>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Current Enrollments
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Review and remove active student course enrollments.
                  </p>
                </div>

                <div className="flex items-center rounded-2xl border border-slate-200 px-4 py-3 lg:w-80 dark:border-slate-700">
                  <Search className="mr-3 h-5 w-5 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search enrollments..."
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                  />
                </div>
              </div>

              {loading ? (
                <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                  Loading enrollments...
                </div>
              ) : filteredEnrollments.length === 0 ? (
                <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                  No enrollments found.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEnrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {enrollment.studentProfile.user.name}
                          </p>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {enrollment.studentProfile.studentId} enrolled in{" "}
                            {enrollment.course.code} - {enrollment.course.title}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDelete(enrollment)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                          {enrollment.course.department.name}
                        </span>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                          {enrollment.course.creditHours} Credit Hours
                        </span>
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-600">
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
