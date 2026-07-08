import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { BookOpen, Users, ClipboardCheck } from "lucide-react";

const courses = [
  { title: "Database Systems", code: "CS-301", students: 120, assignments: 5 },
  { title: "Web Engineering", code: "SE-310", students: 95, assignments: 4 },
  { title: "Computer Networks", code: "IT-210", students: 80, assignments: 3 },
];

export default function FacultyCoursesPage() {
  return (
    <DashboardLayout role="faculty">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assigned Courses</h1>
          <p className="mt-2 text-slate-500">View and manage your assigned courses.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course.code} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <BookOpen className="h-8 w-8 text-emerald-600" />
              <h2 className="mt-5 text-xl font-bold text-slate-900">{course.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{course.code}</p>

              <div className="mt-6 space-y-3">
                <p className="flex items-center gap-2 text-slate-600">
                  <Users className="h-5 w-5 text-blue-600" />
                  {course.students} Students
                </p>
                <p className="flex items-center gap-2 text-slate-600">
                  <ClipboardCheck className="h-5 w-5 text-orange-600" />
                  {course.assignments} Assignments
                </p>
              </div>

              <button className="mt-6 w-full rounded-2xl bg-emerald-600 py-3 font-semibold text-white">
                View Course
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}