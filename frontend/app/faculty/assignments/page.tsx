"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CourseAssignment } from "@/services/adminService";
import { AssignmentSubmission } from "@/services/studentService";
import { FacultyAssignment, facultyService } from "@/services/facultyService";
import {
  Calendar,
  ExternalLink,
  FileText,
  Loader2,
  Search,
  Send,
  Upload,
} from "lucide-react";

export default function FacultyAssignmentsPage() {
  const [courseAssignments, setCourseAssignments] = useState<CourseAssignment[]>([]);
  const [assignments, setAssignments] = useState<FacultyAssignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [submissionSearch, setSubmissionSearch] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [assignedCourses, facultyAssignments, studentSubmissions] =
        await Promise.all([
          facultyService.getMyAssignedCourses(),
          facultyService.getMyAssignments(),
          facultyService.getStudentSubmissions(),
        ]);

      setCourseAssignments(assignedCourses);
      setAssignments(facultyAssignments);
      setSubmissions(studentSubmissions);
    } catch {
      toast.error("Failed to load assignments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const courseAssignmentId = Number(formData.get("courseAssignmentId"));
    const title = String(formData.get("title") || "").trim();
    const instructions = String(formData.get("instructions") || "").trim();
    const dueDate = String(formData.get("dueDate") || "").trim();
    const attachmentUrl = String(formData.get("attachmentUrl") || "").trim();

    if (!courseAssignmentId || !title || !instructions || !dueDate) {
      toast.error("Course, title, instructions, and due date are required.");
      return;
    }

    try {
      setCreating(true);

      const assignment = await facultyService.createAssignment({
        courseAssignmentId,
        title,
        instructions,
        dueDate,
        ...(attachmentUrl ? { attachmentUrl } : {}),
      });

      setAssignments((current) => [assignment, ...current]);
      toast.success("Assignment posted successfully.");
      form.reset();
    } catch {
      toast.error("Failed to post assignment.");
    } finally {
      setCreating(false);
    }
  }

  async function handleGradeSubmission(
    submissionId: number,
    grade: string,
    feedback: string
  ) {
    try {
      const updatedSubmission = await facultyService.gradeSubmission(
        submissionId,
        {
          grade,
          feedback,
        }
      );

      setSubmissions((current) =>
        current.map((submission) =>
          submission.id === submissionId ? updatedSubmission : submission
        )
      );

      toast.success("Submission graded successfully.");
    } catch {
      toast.error("Failed to grade submission.");
    }
  }

  const filteredAssignments = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return assignments;

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

  const upcomingAssignments = assignments.filter(
    (assignment) => new Date(assignment.dueDate) >= new Date()
  ).length;

  const filteredSubmissions = useMemo(() => {
    const term = submissionSearch.trim().toLowerCase();

    if (!term) return submissions;

    return submissions.filter((submission) => {
      const assignment = submission.assignment;
      const course = assignment.courseAssignment.course;
      const student = submission.studentProfile.user;

      return (
        assignment.title.toLowerCase().includes(term) ||
        course.title.toLowerCase().includes(term) ||
        course.code.toLowerCase().includes(term) ||
        student.name.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term)
      );
    });
  }, [submissionSearch, submissions]);

  return (
    <ProtectedRoute role="faculty">
      <DashboardLayout role="faculty">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Upload Assignments
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Create and manage assignments for your assigned courses.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <FileText className="h-8 w-8 text-emerald-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {assignments.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Total Assignments
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {upcomingAssignments}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Upcoming Due Dates
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Send className="h-8 w-8 text-violet-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {submissions.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Student Submissions
              </p>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                New Assignment
              </h2>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <input
                  name="title"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="Assignment title"
                  required
                />

                <select
                  name="courseAssignmentId"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select course
                  </option>
                  {courseAssignments.map((assignment) => (
                    <option key={assignment.id} value={assignment.id}>
                      {assignment.course.code} - {assignment.course.title}
                    </option>
                  ))}
                </select>

                <textarea
                  name="instructions"
                  className="min-h-32 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="Instructions"
                  required
                />

                <input
                  name="dueDate"
                  type="date"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                />

                <input
                  name="attachmentUrl"
                  type="url"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="Attachment URL"
                />

                <button
                  type="submit"
                  disabled={creating || courseAssignments.length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
                >
                  {creating ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Upload className="h-5 w-5" />
                  )}
                  {creating ? "Posting..." : "Post Assignment"}
                </button>

                {courseAssignments.length === 0 && !loading ? (
                  <p className="text-sm text-amber-600">
                    You need an assigned course before posting assignments.
                  </p>
                ) : null}
              </form>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Recent Assignments
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Assignments you have posted for your courses.
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
                  {filteredAssignments.map((assignment) => {
                    const course = assignment.courseAssignment.course;

                    return (
                      <div
                        key={assignment.id}
                        className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
                      >
                        <FileText className="h-6 w-6 text-emerald-600" />
                        <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">
                          {assignment.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {course.code} - {course.title}
                        </p>
                        <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                          {assignment.instructions}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                            <Calendar className="h-4 w-4" />
                            Due:{" "}
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>

                          {assignment.attachmentUrl ? (
                            <a
                              href={assignment.attachmentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Attachment
                            </a>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Student Submissions
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Review submitted work for assignments you posted.
                </p>
              </div>

              <div className="flex items-center rounded-2xl border border-slate-200 px-4 py-3 lg:w-80 dark:border-slate-700">
                <Search className="mr-3 h-5 w-5 text-slate-400" />
                <input
                  value={submissionSearch}
                  onChange={(e) => setSubmissionSearch(e.target.value)}
                  placeholder="Search submissions..."
                  className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] text-left">
                <thead>
                  <tr className="border-b text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <th className="py-4">Student</th>
                    <th>Assignment</th>
                    <th>Course</th>
                    <th>Submitted</th>
                    <th>Comments</th>
                    <th>Grade</th>
                    <th>Feedback</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-8 text-center text-slate-500 dark:text-slate-400"
                      >
                        Loading submissions...
                      </td>
                    </tr>
                  ) : filteredSubmissions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-8 text-center text-slate-500 dark:text-slate-400"
                      >
                        No submissions found.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((submission) => {
                      const assignment = submission.assignment;
                      const course = assignment.courseAssignment.course;
                      const student = submission.studentProfile.user;

                      return (
                        <tr
                          key={submission.id}
                          className="border-b last:border-0 dark:border-slate-800"
                        >
                          <td className="py-5">
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {student.name}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {student.email}
                            </p>
                          </td>

                          <td className="text-slate-600 dark:text-slate-300">
                            {assignment.title}
                          </td>

                          <td className="text-slate-600 dark:text-slate-300">
                            <p>{course.title}</p>
                            <p className="text-sm text-slate-500">
                              {course.code}
                            </p>
                          </td>

                          <td className="text-slate-600 dark:text-slate-300">
                            {new Date(submission.submittedAt).toLocaleString()}
                          </td>

                          <td className="max-w-64 text-sm text-slate-600 dark:text-slate-300">
                            <p className="line-clamp-2">
                              {submission.comments || "No comments"}
                            </p>
                          </td>

                          <td>
                            <input
                              id={`grade-${submission.id}`}
                              defaultValue={submission.grade ?? ""}
                              placeholder="A / 90%"
                              className="w-28 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            />
                          </td>

                          <td>
                            <input
                              id={`feedback-${submission.id}`}
                              defaultValue={submission.feedback ?? ""}
                              placeholder="Feedback"
                              className="w-48 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            />
                          </td>

                          <td className="text-right">
                            <div className="flex justify-end gap-2">
                              <a
                                href={submission.submissionUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Open
                              </a>

                              <button
                                type="button"
                                onClick={() => {
                                  const gradeInput = document.getElementById(
                                    `grade-${submission.id}`
                                  ) as HTMLInputElement;

                                  const feedbackInput =
                                    document.getElementById(
                                      `feedback-${submission.id}`
                                    ) as HTMLInputElement;

                                  handleGradeSubmission(
                                    submission.id,
                                    gradeInput.value,
                                    feedbackInput.value
                                  );
                                }}
                                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                              >
                                Save
                              </button>
                            </div>
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