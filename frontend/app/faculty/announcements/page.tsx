"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CourseAssignment } from "@/services/adminService";
import {
  Announcement,
  facultyService,
} from "@/services/facultyService";
import { Bell, BookOpen, Loader2, Search, Send } from "lucide-react";

export default function FacultyAnnouncementsPage() {
  const [courseAssignments, setCourseAssignments] = useState<
    CourseAssignment[]
  >([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [assignedCourses, announcementData] = await Promise.all([
        facultyService.getMyAssignedCourses(),
        facultyService.getMyAnnouncements(),
      ]);

      setCourseAssignments(assignedCourses);
      setAnnouncements(announcementData);
    } catch {
      toast.error("Failed to load announcements.");
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
    const courseAssignmentId = Number(formData.get("courseAssignmentId"));
    const title = String(formData.get("title") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!courseAssignmentId || !title || !message) {
      toast.error("Course, title, and message are required.");
      return;
    }

    try {
      setPosting(true);
      const announcement = await facultyService.createAnnouncement({
        courseAssignmentId,
        title,
        message,
      });

      setAnnouncements((current) => [announcement, ...current]);
      toast.success("Announcement posted successfully.");
      form.reset();
    } catch {
      toast.error("Failed to post announcement.");
    } finally {
      setPosting(false);
    }
  }

  const filteredAnnouncements = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return announcements;
    }

    return announcements.filter((announcement) => {
      const course = announcement.courseAssignment.course;

      return (
        announcement.title.toLowerCase().includes(term) ||
        announcement.message.toLowerCase().includes(term) ||
        course.title.toLowerCase().includes(term) ||
        course.code.toLowerCase().includes(term)
      );
    });
  }, [announcements, search]);

  return (
    <ProtectedRoute role="faculty">
      <DashboardLayout role="faculty">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Announcements
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Post announcements for students in your assigned courses.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Bell className="h-8 w-8 text-emerald-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {announcements.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Announcements
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {courseAssignments.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Assigned Courses
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Send className="h-8 w-8 text-violet-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {filteredAnnouncements.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Visible Results
              </p>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                New Announcement
              </h2>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <input
                  name="title"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="Announcement title"
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
                  name="message"
                  className="min-h-40 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="Write announcement..."
                  required
                />

                <button
                  type="submit"
                  disabled={posting || courseAssignments.length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
                >
                  {posting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                  {posting ? "Posting..." : "Post Announcement"}
                </button>

                {courseAssignments.length === 0 && !loading ? (
                  <p className="text-sm text-amber-600">
                    You need an assigned course before posting announcements.
                  </p>
                ) : null}
              </form>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Recent Announcements
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Announcements you posted for your courses.
                  </p>
                </div>

                <div className="flex items-center rounded-2xl border border-slate-200 px-4 py-3 lg:w-80 dark:border-slate-700">
                  <Search className="mr-3 h-5 w-5 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search announcements..."
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                  />
                </div>
              </div>

              {loading ? (
                <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                  Loading announcements...
                </div>
              ) : filteredAnnouncements.length === 0 ? (
                <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                  No announcements found.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAnnouncements.map((announcement) => {
                    const course = announcement.courseAssignment.course;

                    return (
                      <div
                        key={announcement.id}
                        className="flex gap-4 rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
                      >
                        <Bell className="mt-1 h-6 w-6 text-emerald-600" />
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {announcement.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {course.code} - {course.title}
                          </p>
                          <p className="mt-3 text-slate-700 dark:text-slate-300">
                            {announcement.message}
                          </p>
                          <p className="mt-4 text-xs text-slate-500">
                            Posted{" "}
                            {new Date(announcement.createdAt).toLocaleString()}
                          </p>
                        </div>
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
