"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  adminService,
  Course,
  CourseAssignment,
  FacultyProfile,
} from "@/services/adminService";
import {
  ArrowRight,
  BookOpen,
  Loader2,
  Search,
  Trash2,
  UserCheck,
  UserCog,
} from "lucide-react";

const semesters = ["Fall 2026", "Spring 2027", "Summer 2027", "Fall 2027"];

export default function AssignFacultyPage() {
  const [faculty, setFaculty] = useState<FacultyProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [search, setSearch] = useState("");

  const fetchAssignmentData = useCallback(async () => {
    try {
      setLoading(true);
      const [facultyData, coursesData, assignmentData] = await Promise.all([
        adminService.getFaculty(),
        adminService.getCourses(),
        adminService.getCourseAssignments(),
      ]);

      setFaculty(facultyData);
      setCourses(coursesData);
      setAssignments(assignmentData);
    } catch {
      toast.error("Failed to load assignment data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAssignmentData();
  }, [fetchAssignmentData]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const facultyProfileId = Number(formData.get("facultyProfileId"));
    const courseId = Number(formData.get("courseId"));
    const semester = String(formData.get("semester") || "").trim();

    if (!facultyProfileId || !courseId || !semester) {
      toast.error("Faculty, course, and semester are required.");
      return;
    }

    try {
      setAssigning(true);
      const assignment = await adminService.assignFacultyToCourse({
        facultyProfileId,
        courseId,
        semester,
      });

      setAssignments((current) => [assignment, ...current]);
      toast.success("Faculty assigned to course successfully.");
      form.reset();
    } catch {
      toast.error("Failed to assign course. This assignment may already exist.");
    } finally {
      setAssigning(false);
    }
  }

  async function handleDelete(assignment: CourseAssignment) {
    const confirmed = window.confirm(
      `Remove ${assignment.facultyProfile.user.name} from ${assignment.course.title}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await adminService.deleteCourseAssignment(assignment.id);
      setAssignments((current) =>
        current.filter((item) => item.id !== assignment.id)
      );
      toast.success("Assignment removed successfully.");
    } catch {
      toast.error("Failed to remove assignment.");
    }
  }

  const filteredAssignments = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return assignments;
    }

    return assignments.filter((assignment) => {
      return (
        assignment.facultyProfile.user.name.toLowerCase().includes(term) ||
        assignment.facultyProfile.facultyId.toLowerCase().includes(term) ||
        assignment.course.title.toLowerCase().includes(term) ||
        assignment.course.code.toLowerCase().includes(term) ||
        assignment.course.department.name.toLowerCase().includes(term) ||
        assignment.semester.toLowerCase().includes(term)
      );
    });
  }, [assignments, search]);

  return (
    <ProtectedRoute role="admin">
      <DashboardLayout role="admin">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Assign Faculty to Courses
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Allocate faculty members to courses and manage teaching
              responsibilities.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <UserCog className="h-8 w-8 text-violet-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {faculty.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Faculty Members
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {courses.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Available Courses
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <UserCheck className="h-8 w-8 text-emerald-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {assignments.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Assigned Courses
              </p>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                New Assignment
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Assign one faculty profile to one course.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Select Faculty
                  </label>
                  <select
                    name="facultyProfileId"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select faculty
                    </option>
                    {faculty.map((facultyMember) => (
                      <option key={facultyMember.id} value={facultyMember.id}>
                        {facultyMember.user.name} - {facultyMember.facultyId}
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

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Semester
                  </label>
                  <select
                    name="semester"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select semester
                    </option>
                    {semesters.map((semester) => (
                      <option key={semester} value={semester}>
                        {semester}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={assigning || faculty.length === 0 || courses.length === 0}
                  className="flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
                >
                  {assigning ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : null}
                  {assigning ? "Assigning..." : "Assign Course"}
                  {!assigning ? <ArrowRight className="ml-2 h-5 w-5" /> : null}
                </button>

                {faculty.length === 0 && !loading ? (
                  <p className="text-sm text-amber-600">
                    Create at least one faculty profile before assigning courses.
                  </p>
                ) : null}

                {courses.length === 0 && !loading ? (
                  <p className="text-sm text-amber-600">
                    Create at least one course before assigning faculty.
                  </p>
                ) : null}
              </form>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Current Assignments
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Review and remove active teaching assignments.
                  </p>
                </div>

                <div className="flex items-center rounded-2xl border border-slate-200 px-4 py-3 lg:w-80 dark:border-slate-700">
                  <Search className="mr-3 h-5 w-5 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search assignments..."
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                  />
                </div>
              </div>

              {loading ? (
                <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                  Loading assignments...
                </div>
              ) : filteredAssignments.length === 0 ? (
                <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                  No assignments found.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {assignment.course.title}
                          </p>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {assignment.course.code} assigned to{" "}
                            {assignment.facultyProfile.user.name}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDelete(assignment)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                          {assignment.course.department.name}
                        </span>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                          {assignment.semester}
                        </span>
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-600">
                          {assignment.facultyProfile.facultyId}
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
