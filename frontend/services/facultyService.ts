import API from "./api";
import type { CourseAssignment } from "./adminService";
import type { AssignmentSubmission } from "./studentService";

export interface FacultyAssignment {
  id: number;
  courseAssignmentId: number;
  title: string;
  instructions: string;
  dueDate: string;
  attachmentUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  courseAssignment: CourseAssignment;
}

export interface Announcement {
  id: number;
  courseAssignmentId: number;
  title: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  courseAssignment: CourseAssignment;
}

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export interface AttendanceRecord {
  id: number;
  courseAssignmentId: number;
  studentProfileId: number;
  date: string;
  status: AttendanceStatus;
  remarks?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceStudent {
  id: number;
  studentId: string;
  semester: number;
  user: {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "FACULTY" | "STUDENT";
    status: "ACTIVE" | "INACTIVE";
  };
}

export interface AttendanceRoster {
  courseAssignment: CourseAssignment;
  students: AttendanceStudent[];
  records: AttendanceRecord[];
}

export const facultyService = {
  getMyAssignedCourses: async (): Promise<CourseAssignment[]> => {
    const response = await API.get("/course-assignments/my-courses");
    return response.data;
  },

  createAssignment: async (data: {
    courseAssignmentId: number;
    title: string;
    instructions: string;
    dueDate: string;
    attachmentUrl?: string;
  }) => {
    const response = await API.post("/assignments", data);
    return response.data;
  },

  getMyAssignments: async (): Promise<FacultyAssignment[]> => {
    const response = await API.get("/assignments/my");
    return response.data;
  },

  getStudentSubmissions: async (): Promise<AssignmentSubmission[]> => {
    const response = await API.get("/assignment-submissions/faculty/my");
    return response.data;
  },

  gradeSubmission: async (
    submissionId: number,
    data: { grade?: string; feedback?: string }
  ): Promise<AssignmentSubmission> => {
    const response = await API.patch(
      `/assignment-submissions/${submissionId}/grade`,
      data
    );
    return response.data;
  },

  createAnnouncement: async (data: {
    courseAssignmentId: number;
    title: string;
    message: string;
  }) => {
    const response = await API.post("/announcements", data);
    return response.data;
  },

  getMyAnnouncements: async (): Promise<Announcement[]> => {
    const response = await API.get("/announcements/my");
    return response.data;
  },

  getAttendanceRoster: async (
    courseAssignmentId: number,
    date: string
  ): Promise<AttendanceRoster> => {
    const response = await API.get(
      `/attendance/faculty/course/${courseAssignmentId}`,
      {
        params: { date },
      }
    );
    return response.data;
  },

  markAttendance: async (data: {
    courseAssignmentId: number;
    date: string;
    records: Array<{
      studentProfileId: number;
      status: AttendanceStatus;
      remarks?: string;
    }>;
  }): Promise<AttendanceRoster> => {
    const response = await API.post("/attendance/faculty", data);
    return response.data;
  },
};