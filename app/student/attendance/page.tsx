import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { UserCheck, CalendarCheck, CalendarX, Clock } from "lucide-react";

const attendance = [
  { course: "Database Systems", present: 24, absent: 2, percentage: "92%" },
  { course: "Web Engineering", present: 22, absent: 3, percentage: "88%" },
  { course: "Computer Networks", present: 25, absent: 1, percentage: "96%" },
];

export default function StudentAttendancePage() {
  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Attendance Records
          </h1>
          <p className="mt-2 text-slate-500">
            Track your attendance percentage across all courses.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <StatCard
            title="Overall Attendance"
            value="92%"
            description="Across all courses"
            icon={UserCheck}
            color="blue"
          />
          <StatCard
            title="Present Classes"
            value="71"
            description="Total attended classes"
            icon={CalendarCheck}
            color="emerald"
          />
          <StatCard
            title="Absent Classes"
            value="6"
            description="Total missed classes"
            icon={CalendarX}
            color="orange"
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Course-wise Attendance
          </h2>

          <div className="mt-6 space-y-5">
            {attendance.map((item) => (
              <div key={item.course} className="rounded-2xl bg-slate-50 p-5">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {item.course}
                    </h3>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="h-4 w-4" />
                      Present {item.present} / Absent {item.absent}
                    </p>
                  </div>

                  <span className="text-2xl font-bold text-blue-600">
                    {item.percentage}
                  </span>
                </div>

                <div className="mt-4 h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-blue-600"
                    style={{ width: item.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}