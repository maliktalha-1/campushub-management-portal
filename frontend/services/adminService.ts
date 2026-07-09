import API from "./api";

export interface Department {
  id: number;
  name: string;
  code: string;
  courses: Array<{
    id: number;
    code: string;
    title: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
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
  createdAt: string;
  updatedAt: string;
}

export interface UserAccount {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "FACULTY" | "STUDENT";
  status: "ACTIVE" | "INACTIVE";
}

export interface StudentProfile {
  id: number;
  userId: number;
  departmentId: number;
  studentId: string;
  semester: number;
  phone?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  user: UserAccount;
  department: {
    id: number;
    name: string;
    code: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FacultyProfile {
  id: number;
  userId: number;
  departmentId: number;
  facultyId: string;
  designation: string;
  qualification?: string | null;
  phone?: string | null;
  officeLocation?: string | null;
  user: UserAccount;
  department: {
    id: number;
    name: string;
    code: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CourseAssignment {
  id: number;
  facultyProfileId: number;
  courseId: number;
  semester: string;
  facultyProfile: FacultyProfile;
  course: Course;
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentCourseAssignment {
  id: number;
  facultyProfileId: number;
  courseId: number;
  semester: string;
  createdAt: string;
  updatedAt: string;
  facultyProfile: FacultyProfile;
}

export interface Enrollment {
  id: number;
  studentProfileId: number;
  courseId: number;
  enrolledAt: string;
  createdAt: string;
  updatedAt: string;
  studentProfile: StudentProfile;
  course: Course & {
    assignments?: EnrollmentCourseAssignment[];
  };
}

export const adminService = {
  // Create User
  createUser: async (data: {
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "FACULTY" | "STUDENT";
  }) => {
    const response = await API.post("/users", data);
    return response.data;
  },

  // Get All Users
  getUsers: async (): Promise<UserAccount[]> => {
    const response = await API.get("/users");
    return response.data;
  },

  // Activate / Deactivate User
  updateUserStatus: async (
    id: number,
    status: "ACTIVE" | "INACTIVE"
  ) => {
    const response = await API.patch(`/users/${id}/status`, {
      status,
    });

    return response.data;
  },

  // Create Department
  createDepartment: async (data: { name: string; code: string }) => {
    const response = await API.post("/departments", data);
    return response.data;
  },

  // Get All Departments
  getDepartments: async (): Promise<Department[]> => {
    const response = await API.get("/departments");
    return response.data;
  },

  // Create Course
  createCourse: async (data: {
    code: string;
    title: string;
    creditHours: number;
    departmentId: number;
  }) => {
    const response = await API.post("/courses", data);
    return response.data;
  },

  // Get All Courses
  getCourses: async (): Promise<Course[]> => {
    const response = await API.get("/courses");
    return response.data;
  },

  // Create Student Profile
  createStudent: async (data: {
    userId: number;
    departmentId: number;
    studentId: string;
    semester: number;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
  }) => {
    const response = await API.post("/students", data);
    return response.data;
  },

  // Get All Student Profiles
  getStudents: async (): Promise<StudentProfile[]> => {
    const response = await API.get("/students");
    return response.data;
  },

  // Update Student Profile
  updateStudent: async (
    id: number,
    data: {
      departmentId?: number;
      studentId?: string;
      semester?: number;
      phone?: string;
      address?: string;
      dateOfBirth?: string;
    }
  ) => {
    const response = await API.patch(`/students/${id}`, data);
    return response.data;
  },

  // Delete Student Profile
  deleteStudent: async (id: number) => {
    const response = await API.delete(`/students/${id}`);
    return response.data;
  },

  // Create Faculty Profile
  createFaculty: async (data: {
    userId: number;
    departmentId: number;
    facultyId: string;
    designation: string;
    qualification?: string;
    phone?: string;
    officeLocation?: string;
  }) => {
    const response = await API.post("/faculty", data);
    return response.data;
  },

  // Get All Faculty Profiles
  getFaculty: async (): Promise<FacultyProfile[]> => {
    const response = await API.get("/faculty");
    return response.data;
  },

  // Update Faculty Profile
  updateFaculty: async (
    id: number,
    data: {
      departmentId?: number;
      facultyId?: string;
      designation?: string;
      qualification?: string;
      phone?: string;
      officeLocation?: string;
    }
  ) => {
    const response = await API.patch(`/faculty/${id}`, data);
    return response.data;
  },

  // Delete Faculty Profile
  deleteFaculty: async (id: number) => {
    const response = await API.delete(`/faculty/${id}`);
    return response.data;
  },

  // Assign Faculty to Course
  assignFacultyToCourse: async (data: {
    facultyProfileId: number;
    courseId: number;
    semester: string;
  }) => {
    const response = await API.post("/course-assignments", data);
    return response.data;
  },

  // Get All Course Assignments
  getCourseAssignments: async (): Promise<CourseAssignment[]> => {
    const response = await API.get("/course-assignments");
    return response.data;
  },

  // Get Course Assignments by Faculty
  getCourseAssignmentsByFaculty: async (
    facultyProfileId: number
  ): Promise<CourseAssignment[]> => {
    const response = await API.get(
      `/course-assignments/faculty/${facultyProfileId}`
    );
    return response.data;
  },

  // Remove Course Assignment
  deleteCourseAssignment: async (id: number) => {
    const response = await API.delete(`/course-assignments/${id}`);
    return response.data;
  },

  // Enroll Student in Course
  enrollStudent: async (data: {
    studentProfileId: number;
    courseId: number;
  }) => {
    const response = await API.post("/enrollments", data);
    return response.data;
  },

  // Get All Enrollments
  getEnrollments: async (): Promise<Enrollment[]> => {
    const response = await API.get("/enrollments");
    return response.data;
  },

  // Remove Enrollment
  deleteEnrollment: async (id: number) => {
    const response = await API.delete(`/enrollments/${id}`);
    return response.data;
  },
};
