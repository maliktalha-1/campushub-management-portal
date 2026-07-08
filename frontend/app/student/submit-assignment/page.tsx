import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Upload, FileUp, Send } from "lucide-react";

export default function SubmitAssignmentPage() {
  return (
    <ProtectedRoute role="student">
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Submit Assignment
          </h1>
          <p className="mt-2 text-slate-500">
            Upload and submit your completed assignments.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              New Submission
            </h2>

            <form className="mt-6 space-y-5">
              <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                <option>Select Assignment</option>
                <option>ERD Design Task</option>
                <option>React Components Lab</option>
                <option>Subnetting Practice</option>
              </select>

              <textarea
                className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                placeholder="Add comments..."
              />

              <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <FileUp className="mx-auto h-10 w-10 text-blue-600" />
                <p className="mt-4 font-semibold text-slate-700">
                  Upload your file here
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  PDF, DOCX, ZIP files supported
                </p>
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-semibold text-white">
                <Send className="h-5 w-5" />
                Submit Assignment
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Submission Guidelines
            </h2>

            <div className="mt-6 space-y-4">
              {[
                "Submit before the deadline.",
                "Use proper file naming format.",
                "Only upload supported file types.",
                "Late submissions may be marked separately.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"
                >
                  <Upload className="mt-1 h-5 w-5 text-blue-600" />
                  <p className="text-slate-600">{item}</p>
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