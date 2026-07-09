"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FacultyAssignment } from "@/services/facultyService";
import {
  AssignmentSubmission,
  studentService,
} from "@/services/studentService";
import {
  Calendar,
  ExternalLink,
  FileCheck2,
  FileUp,
  Loader2,
  Search,
  Send,
  Upload,
} from "lucide-react";

export default function SubmitAssignmentPage() {
  const [assignments, setAssignments] = useState<FacultyAssignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [assignmentData, submissionData] = await Promise.all([
        studentService.getMyAssignments(),
        studentService.getMySubmissions(),
      ]);

      setAssignments(assignmentData);
      setSubmissions(submissionData);
    } catch {
      toast.error("Failed to load submission data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const assignmentId = Number(formData.get("assignmentId"));
    const submissionUrl = String(formData.get("submissionUrl") || "").trim();
    const comments = String(formData.get("comments") || "").trim();

    if (!assignmentId || !submissionUrl) {
      toast.error("Assignment and submission URL are required.");
      return;
    }

    try {
      setSubmitting(true);
      const submission = await studentService.submitAssignment({
        assignmentId,
        submissionUrl,
        ...(comments ? { comments } : {}),
      });

      setSubmissions((current) => {
        const exists = current.some((item) => item.id === submission.id);

        if (exists) {
          return current.map((item) =>
            item.id === submission.id ? submission : item
          );
        }

        return [submission, ...current];
      });

      toast.success("Assignment submitted successfully.");
      form.reset();
    } catch {
      toast.error("Failed to submit assignment.");
    } finally {
      setSubmitting(false);
    }
  }

  const submittedAssignmentIds = useMemo(() => {
    return new Set(submissions.map((submission) => submission.assignmentId));
  }, [submissions]);

  const pendingAssignments = assignments.filter(
    (assignment) => !submittedAssignmentIds.has(assignment.id)
  );

  const filteredSubmissions = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return submissions;
    }

    return submissions.filter((submission) => {
      const course = submission.assignment.courseAssignment.course;

      return (
        submission.assignment.title.toLowerCase().includes(term) ||
        course.title.toLowerCase().includes(term) ||
        course.code.toLowerCase().includes(term) ||
        submission.submissionUrl.toLowerCase().includes(term)
      );
    });
  }, [search, submissions]);

  return (
    <ProtectedRoute role="student">
      <DashboardLayout role="student">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Submit Assignment
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Submit completed work and review your submission history.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <FileCheck2 className="h-8 w-8 text-emerald-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {submissions.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">Submitted</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <FileUp className="h-8 w-8 text-blue-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {pendingAssignments.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">Pending</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Upload className="h-8 w-8 text-violet-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {assignments.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Available Assignments
              </p>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                New Submission
              </h2>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <select
                  name="assignmentId"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select assignment
                  </option>
                  {assignments.map((assignment) => {
                    const course = assignment.courseAssignment.course;
                    const submitted = submittedAssignmentIds.has(assignment.id);

                    return (
                      <option key={assignment.id} value={assignment.id}>
                        {submitted ? "Update: " : ""}
                        {course.code} - {assignment.title}
                      </option>
                    );
                  })}
                </select>

                <input
                  name="submissionUrl"
                  type="url"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="Submission URL"
                  required
                />

                <textarea
                  name="comments"
                  className="min-h-32 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="Add comments..."
                />

                <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950">
                  <FileUp className="mx-auto h-10 w-10 text-blue-600" />
                  <p className="mt-4 font-semibold text-slate-700 dark:text-slate-200">
                    Paste a shareable submission link
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Google Drive, OneDrive, GitHub, or hosted file links work.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting || assignments.length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                  {submitting ? "Submitting..." : "Submit Assignment"}
                </button>

                {assignments.length === 0 && !loading ? (
                  <p className="text-sm text-amber-600">
                    No assignments are available to submit yet.
                  </p>
                ) : null}
              </form>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Submission History
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Your latest submission is kept for each assignment.
                  </p>
                </div>

                <div className="flex items-center rounded-2xl border border-slate-200 px-4 py-3 lg:w-80 dark:border-slate-700">
                  <Search className="mr-3 h-5 w-5 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search submissions..."
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                  />
                </div>
              </div>

              {loading ? (
                <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                  Loading submissions...
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                  No submissions found.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSubmissions.map((submission) => {
                    const assignment = submission.assignment;
                    const course = assignment.courseAssignment.course;

                    return (
                      <div
                        key={submission.id}
                        className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                              {assignment.title}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              {course.code} - {course.title}
                            </p>
                          </div>

                          <a
                            href={submission.submissionUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Open
                          </a>
                        </div>

                        {submission.comments ? (
                          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                            {submission.comments}
                          </p>
                        ) : null}

                        <p className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Calendar className="h-4 w-4" />
                          Submitted:{" "}
                          {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
