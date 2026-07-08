import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Bell, Send } from "lucide-react";

const announcements = [
  "Midterm schedule uploaded for Database Systems.",
  "Assignment submission deadline extended.",
  "Quiz will be held next Monday.",
];

export default function FacultyAnnouncementsPage() {
  return (
    <DashboardLayout role="faculty">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Announcements</h1>
          <p className="mt-2 text-slate-500">Post announcements for your students.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">New Announcement</h2>

            <form className="mt-6 space-y-5">
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Announcement title" />
              <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                <option>All Courses</option>
                <option>Database Systems</option>
                <option>Web Engineering</option>
              </select>
              <textarea className="min-h-40 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Write announcement..." />

              <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 font-semibold text-white">
                <Send className="h-5 w-5" />
                Post Announcement
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Recent Announcements</h2>

            <div className="mt-6 space-y-4">
              {announcements.map((item) => (
                <div key={item} className="flex gap-4 rounded-2xl bg-slate-50 p-5">
                  <Bell className="h-6 w-6 text-emerald-600" />
                  <p className="text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}