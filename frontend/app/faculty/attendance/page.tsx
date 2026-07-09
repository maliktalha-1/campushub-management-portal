"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CourseAssignment } from "@/services/adminService";
import {
  AttendanceRecord,
  AttendanceRoster,
  AttendanceStatus,
  facultyService,
} from "@/services/facultyService";
import { ClipboardCheck, Loader2, Save, Search } from "lucide-react";

const today = new Date().toISOString().slice(0, 10);

export default function FacultyAttendancePage() {
  const [courseAssignments, setCourseAssignments] = useState<
    CourseAssignment[]
  >([]);
  const [selectedCourseAssignmentId, setSelectedCourseAssignmentId] =
    useState("");
  const [date, setDate] = useState(today);
  const [roster, setRoster] = useState<AttendanceRoster | null>(null);
  const [records, setRecords] = useState<
    Record<number, { status: AttendanceStatus; remarks: string }>
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await facultyService.getMyAssignedCourses();
      setCourseAssignments(data);

      if (data.length > 0) {
        setSelectedCourseAssignmentId(String(data[0].id));
      }
    } catch {
      toast.error("Failed to load assigned courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCourses();
  }, [fetchCourses]);

  const loadRoster = useCallback(async () => {
    if (!selectedCourseAssignmentId || !date) {
      return;
    }

    try {
      setLoading(true);
      const data = await facultyService.getAttendanceRoster(
        Number(selectedCourseAssignmentId),
        date
      );
      setRoster(data);
      setRecords(buildRecordState(data.records));
    } catch {
      toast.error("Failed to load attendance roster.");
    } finally {
      setLoading(false);
    }
  }, [date, selectedCourseAssignmentId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRoster();
  }, [loadRoster]);

  function buildRecordState(attendanceRecords: AttendanceRecord[]) {
    return attendanceRecords.reduce<
      Record<number, { status: AttendanceStatus; remarks: string }>
    >((acc, record) => {
      acc[record.studentProfileId] = {
        status: record.status,
        remarks: record.remarks ?? "",
      };
      return acc;
    }, {});
  }

  function updateRecord(
    studentProfileId: number,
    field: "status" | "remarks",
    value: string
  ) {
    setRecords((current) => ({
      ...current,
      [studentProfileId]: {
        status:
          field === "status"
            ? (value as AttendanceStatus)
            : current[studentProfileId]?.status ?? "PRESENT",
        remarks:
          field === "remarks"
            ? value
            : current[studentProfileId]?.remarks ?? "",
      },
    }));
  }

  async function handleSave() {
    if (!roster || !selectedCourseAssignmentId) {
      return;
    }

    try {
      setSaving(true);
      const updatedRoster = await facultyService.markAttendance({
        courseAssignmentId: Number(selectedCourseAssignmentId),
        date,
        records: roster.students.map((student) => ({
          studentProfileId: student.id,
          status: records[student.id]?.status ?? "PRESENT",
          remarks: records[student.id]?.remarks || undefined,
        })),
      });

      setRoster(updatedRoster);
      setRecords(buildRecordState(updatedRoster.records));
      toast.success("Attendance saved successfully.");
    } catch {
      toast.error("Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  }

  const filteredStudents = useMemo(() => {
    const students = roster?.students ?? [];
    const term = search.trim().toLowerCase();

    if (!term) {
      return students;
    }

    return students.filter((student) => {
      return (
        student.user.name.toLowerCase().includes(term) ||
        student.user.email.toLowerCase().includes(term) ||
        student.studentId.toLowerCase().includes(term)
      );
    });
  }, [roster, search]);

  const markedCount = roster?.students.filter((student) => records[student.id])
    .length ?? 0;

  return (
    <ProtectedRoute role="faculty">
      <DashboardLayout role="faculty">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Record Attendance
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Mark and manage student attendance for your assigned courses.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <ClipboardCheck className="h-8 w-8 text-emerald-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {roster?.students.length ?? 0}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Students
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Save className="h-8 w-8 text-blue-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {markedCount}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">Marked</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Search className="h-8 w-8 text-violet-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {courseAssignments.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Assigned Courses
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_180px]">
              <select
                value={selectedCourseAssignmentId}
                onChange={(e) => setSelectedCourseAssignmentId(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {courseAssignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.course.code} - {assignment.course.title}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <button
                onClick={loadRoster}
                disabled={!selectedCourseAssignmentId || loading}
                className="rounded-2xl bg-emerald-600 py-3 font-semibold text-white disabled:opacity-70"
              >
                Load Students
              </button>
            </div>

            <div className="mt-6 flex max-w-md items-center rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
              <Search className="mr-3 h-5 w-5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[780px] text-left">
                <thead>
                  <tr className="border-b text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <th className="py-4">Student</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-8 text-center text-slate-500 dark:text-slate-400"
                      >
                        Loading students...
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-8 text-center text-slate-500 dark:text-slate-400"
                      >
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b last:border-0 dark:border-slate-800"
                      >
                        <td className="py-5">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {student.user.name}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {student.studentId} - {student.user.email}
                          </p>
                        </td>
                        <td>
                          <select
                            value={records[student.id]?.status ?? "PRESENT"}
                            onChange={(e) =>
                              updateRecord(student.id, "status", e.target.value)
                            }
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          >
                            <option value="PRESENT">Present</option>
                            <option value="ABSENT">Absent</option>
                            <option value="LATE">Late</option>
                          </select>
                        </td>
                        <td>
                          <input
                            value={records[student.id]?.remarks ?? ""}
                            onChange={(e) =>
                              updateRecord(student.id, "remarks", e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            placeholder="Optional"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleSave}
              disabled={!roster || saving || loading}
              className="mt-6 flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white disabled:opacity-70"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
