import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MarkAttendanceDto } from "./dto/mark-attendance.dto";

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async getCourseRoster(userId: number, courseAssignmentId: number, date: string) {
    const facultyProfile = await this.findFacultyProfile(userId);
    const courseAssignment = await this.findOwnedCourseAssignment(
      facultyProfile.id,
      courseAssignmentId,
    );
    const attendanceDate = this.parseAttendanceDate(date);

    const [students, records] = await Promise.all([
      this.prisma.studentProfile.findMany({
        where: {
          enrollments: {
            some: {
              courseId: courseAssignment.courseId,
            },
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
            },
          },
          department: true,
        },
        orderBy: {
          studentId: "asc",
        },
      }),
      this.prisma.attendanceRecord.findMany({
        where: {
          courseAssignmentId,
          date: attendanceDate,
        },
      }),
    ]);

    return {
      courseAssignment,
      students,
      records,
    };
  }

  async markForFaculty(userId: number, dto: MarkAttendanceDto) {
    const facultyProfile = await this.findFacultyProfile(userId);
    const courseAssignment = await this.findOwnedCourseAssignment(
      facultyProfile.id,
      dto.courseAssignmentId,
    );
    const attendanceDate = this.parseAttendanceDate(dto.date);

    const studentIds = dto.records.map((record) => record.studentProfileId);
    const validStudents = await this.prisma.studentProfile.findMany({
      where: {
        id: {
          in: studentIds,
        },
        enrollments: {
          some: {
            courseId: courseAssignment.courseId,
          },
        },
      },
      select: {
        id: true,
      },
    });
    const validStudentIds = new Set(validStudents.map((student) => student.id));

    if (validStudentIds.size !== studentIds.length) {
      throw new BadRequestException("One or more students are not enrolled in this course");
    }

    await this.prisma.$transaction(
      dto.records.map((record) =>
        this.prisma.attendanceRecord.upsert({
          where: {
            courseAssignmentId_studentProfileId_date: {
              courseAssignmentId: dto.courseAssignmentId,
              studentProfileId: record.studentProfileId,
              date: attendanceDate,
            },
          },
          create: {
            courseAssignmentId: dto.courseAssignmentId,
            studentProfileId: record.studentProfileId,
            date: attendanceDate,
            status: record.status,
            remarks: record.remarks,
          },
          update: {
            status: record.status,
            remarks: record.remarks,
          },
        }),
      ),
    );

    return this.getCourseRoster(userId, dto.courseAssignmentId, dto.date);
  }

  async findForStudent(userId: number) {
    const studentProfile = await this.prisma.studentProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!studentProfile) {
      throw new NotFoundException("Student profile not found");
    }

    return this.prisma.attendanceRecord.findMany({
      where: {
        studentProfileId: studentProfile.id,
      },
      include: this.includeRelations(),
      orderBy: {
        date: "desc",
      },
    });
  }

  private async findFacultyProfile(userId: number) {
    const facultyProfile = await this.prisma.facultyProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!facultyProfile) {
      throw new NotFoundException("Faculty profile not found");
    }

    return facultyProfile;
  }

  private async findOwnedCourseAssignment(
    facultyProfileId: number,
    courseAssignmentId: number,
  ) {
    const courseAssignment = await this.prisma.courseAssignment.findUnique({
      where: {
        id: courseAssignmentId,
      },
      include: {
        course: {
          include: {
            department: true,
          },
        },
        facultyProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!courseAssignment) {
      throw new NotFoundException("Course assignment not found");
    }

    if (courseAssignment.facultyProfileId !== facultyProfileId) {
      throw new ForbiddenException("You can only manage attendance for your assigned courses");
    }

    return courseAssignment;
  }

  private parseAttendanceDate(date: string) {
    return new Date(`${date}T00:00:00.000Z`);
  }

  private includeRelations() {
    return {
      courseAssignment: {
        include: {
          course: {
            include: {
              department: true,
            },
          },
          facultyProfile: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  status: true,
                },
              },
            },
          },
        },
      },
      studentProfile: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
            },
          },
        },
      },
    };
  }
}
