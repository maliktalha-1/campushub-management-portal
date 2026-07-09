import API from "./api";
import type { Enrollment, StudentProfile } from "./adminService";
import type { Announcement } from "./facultyService";
import type { AttendanceRecord } from "./facultyService";
import type { FacultyAssignment } from "./facultyService";

export interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  studentProfileId: number;
  submissionUrl: string;
  comments?: string | null;
  grade?: string | null;
  feedback?: string | null;
  submittedAt: string;
  updatedAt: string;
  assignment: FacultyAssignment;
  studentProfile: StudentProfile;
}

export interface StudentAttendanceRecord extends AttendanceRecord {
  courseAssignment: {
    id: number;
    semester: string;
    course: {
      id: number;
      code: string;
      title: string;
      creditHours: number;
      departmentId: number;
      department: {
        id: number;
        name: string;
        code: string;
      };
    };
    facultyProfile: {
      user: {
        id: number;
        name: string;
        email: string;
        role: "ADMIN" | "FACULTY" | "STUDENT";
        status: "ACTIVE" | "INACTIVE";
      };
    };
  };
}

export const studentService = {
  getMyProfile: async (): Promise<StudentProfile> => {
    const response = await API.get("/students/me");
    return response.data;
  },

  updateMyProfile: async (data: {
    phone?: string;
    address?: string;
    dateOfBirth?: string;
  }): Promise<StudentProfile> => {
    const response = await API.patch("/students/me", data);
    return response.data;
  },

  getMyCourses: async (): Promise<Enrollment[]> => {
    const response = await API.get("/enrollments/my-courses");
    return response.data;
  },

  getMyAssignments: async (): Promise<FacultyAssignment[]> => {
    const response = await API.get("/assignments/student/my");
    return response.data;
  },

  submitAssignment: async (data: {
    assignmentId: number;
    submissionUrl: string;
    comments?: string;
  }) => {
    const response = await API.post("/assignment-submissions", data);
    return response.data;
  },

  getMySubmissions: async (): Promise<AssignmentSubmission[]> => {
    const response = await API.get("/assignment-submissions/my");
    return response.data;
  },

  getMyAnnouncements: async (): Promise<Announcement[]> => {
    const response = await API.get("/announcements/student/my");
    return response.data;
  },

  getMyAttendance: async (): Promise<StudentAttendanceRecord[]> => {
    const response = await API.get("/attendance/student/my");
    return response.data;
  },
};
