import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { UserCheck, BookOpen, UserCog, ArrowRight } from "lucide-react";

const assignments = [
  {
    faculty: "Dr. Sarah Ahmed",
    course: "Database Systems",
    department: "Computer Science",
    semester: "Fall 2026",
  },
  {
    faculty: "Prof. Usman Malik",
    course: "Software Engineering",
    department: "Software Engineering",
    semester: "Fall 2026",
  },
  {
    faculty: "Dr. Hina Tariq",
    course: "Computer Networks",
    department: "Information Technology",
    semester: "Fall 2026",
  },
];

export default function AssignFacultyPage() {
  return (
    <ProtectedRoute role="admin">
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Assign Faculty to Courses
          </h1>
          <p className="mt-2 text-slate-500">
            Allocate faculty members to courses and manage teaching responsibilities.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <UserCog className="h-8 w-8 text-violet-600" />
            <h3 className="mt-4 text-3xl font-bold text-slate-900">180</h3>
            <p className="text-slate-500">Faculty Members</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h3 className="mt-4 text-3xl font-bold text-slate-900">96</h3>
            <p className="text-slate-500">Available Courses</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <UserCheck className="h-8 w-8 text-emerald-600" />
            <h3 className="mt-4 text-3xl font-bold text-slate-900">76</h3>
            <p className="text-slate-500">Assigned Courses</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              New Assignment
            </h2>

            <form className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Select Faculty
                </label>
                <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500">
                  <option>Dr. Sarah Ahmed</option>
                  <option>Prof. Usman Malik</option>
                  <option>Dr. Hina Tariq</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Select Course
                </label>
                <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500">
                  <option>Database Systems</option>
                  <option>Software Engineering</option>
                  <option>Computer Networks</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Semester
                </label>
                <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500">
                  <option>Fall 2026</option>
                  <option>Spring 2027</option>
                </select>
              </div>

              <button className="flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700">
                Assign Course
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Current Assignments
            </h2>

            <div className="mt-6 space-y-4">
              {assignments.map((item) => (
                <div
                  key={`${item.faculty}-${item.course}`}
                  className="rounded-2xl bg-slate-50 p-5"
                >
                  <p className="font-semibold text-slate-900">{item.course}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.faculty}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                      {item.department}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                      {item.semester}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
}