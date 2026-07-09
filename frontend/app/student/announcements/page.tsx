"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Announcement } from "@/services/facultyService";
import { studentService } from "@/services/studentService";
import { Bell, BookOpen, Search, UserCog } from "lucide-react";

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await studentService.getMyAnnouncements();
      setAnnouncements(data);
    } catch {
      toast.error("Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const filteredAnnouncements = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return announcements;
    }

    return announcements.filter((announcement) => {
      const course = announcement.courseAssignment.course;
      const faculty = announcement.courseAssignment.facultyProfile.user;

      return (
        announcement.title.toLowerCase().includes(term) ||
        announcement.message.toLowerCase().includes(term) ||
        course.title.toLowerCase().includes(term) ||
        course.code.toLowerCase().includes(term) ||
        faculty.name.toLowerCase().includes(term)
      );
    });
  }, [announcements, search]);

  const courseCount = new Set(
    announcements.map((announcement) => announcement.courseAssignment.courseId)
  ).size;

  return (
    <ProtectedRoute role="student">
      <DashboardLayout role="student">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Announcements
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              View announcements from faculty for your enrolled courses.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Bell className="h-8 w-8 text-violet-600" />
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
                {courseCount}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">Courses</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Search className="h-8 w-8 text-emerald-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {filteredAnnouncements.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Visible Results
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex max-w-md items-center rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
              <Search className="mr-3 h-5 w-5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search announcements..."
                className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
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
                  const faculty =
                    announcement.courseAssignment.facultyProfile.user;

                  return (
                    <div
                      key={announcement.id}
                      className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
                    >
                      <div className="flex gap-4">
                        <Bell className="mt-1 h-6 w-6 text-violet-600" />
                        <div className="min-w-0 flex-1">
                          <h2 className="font-semibold text-slate-900 dark:text-white">
                            {announcement.title}
                          </h2>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {course.code} - {course.title}
                          </p>
                          <p className="mt-4 text-slate-700 dark:text-slate-300">
                            {announcement.message}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                              <BookOpen className="h-4 w-4" />
                              {course.department.name}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                              <UserCog className="h-4 w-4" />
                              {faculty.name}
                            </span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              {new Date(
                                announcement.createdAt
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
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
