import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  BookOpen,
  Plus,
  Search,
  MoreVertical,
  GraduationCap,
  UserCog,
} from "lucide-react";

const courses = [
  {
    code: "CS-301",
    title: "Database Systems",
    department: "Computer Science",
    faculty: "Dr. Sarah Ahmed",
    students: 120,
    status: "Active",
  },
  {
    code: "SE-204",
    title: "Software Engineering",
    department: "Software Engineering",
    faculty: "Prof. Usman Malik",
    students: 95,
    status: "Active",
  },
  {
    code: "IT-210",
    title: "Computer Networks",
    department: "Information Technology",
    faculty: "Dr. Hina Tariq",
    students: 85,
    status: "Inactive",
  },
];

export default function AdminCoursesPage() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Manage Courses
            </h1>
            <p className="mt-2 text-slate-500">
              Create courses, assign departments, and monitor course activity.
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
            <Plus className="h-5 w-5" />
            Add Course
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h3 className="mt-4 text-3xl font-bold text-slate-900">96</h3>
            <p className="text-slate-500">Total Courses</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <GraduationCap className="h-8 w-8 text-emerald-600" />
            <h3 className="mt-4 text-3xl font-bold text-slate-900">2,540</h3>
            <p className="text-slate-500">Enrolled Students</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <UserCog className="h-8 w-8 text-violet-600" />
            <h3 className="mt-4 text-3xl font-bold text-slate-900">180</h3>
            <p className="text-slate-500">Faculty Members</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 lg:w-96">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                placeholder="Search courses..."
                className="w-full bg-transparent outline-none"
              />
            </div>

            <div className="flex gap-3">
              <select className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                <option>All Departments</option>
                <option>Computer Science</option>
                <option>Software Engineering</option>
                <option>Information Technology</option>
              </select>

              <select className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b text-sm text-slate-500">
                  <th className="py-4">Course</th>
                  <th>Department</th>
                  <th>Faculty</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course) => (
                  <tr key={course.code} className="border-b last:border-0">
                    <td className="py-5">
                      <p className="font-semibold text-slate-900">
                        {course.title}
                      </p>
                      <p className="text-sm text-slate-500">{course.code}</p>
                    </td>

                    <td className="text-slate-600">{course.department}</td>
                    <td className="text-slate-600">{course.faculty}</td>
                    <td className="text-slate-600">{course.students}</td>

                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          course.status === "Active"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>

                    <td className="text-right">
                      <button className="rounded-xl p-2 hover:bg-slate-100">
                        <MoreVertical className="h-5 w-5 text-slate-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}