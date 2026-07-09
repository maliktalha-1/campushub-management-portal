import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAssignmentDto } from "./dto/create-assignment.dto";

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async createForFaculty(userId: number, dto: CreateAssignmentDto) {
    const facultyProfile = await this.findFacultyProfile(userId);
    const courseAssignment = await this.prisma.courseAssignment.findUnique({
      where: {
        id: dto.courseAssignmentId,
      },
    });

    if (!courseAssignment) {
      throw new NotFoundException("Course assignment not found");
    }

    if (courseAssignment.facultyProfileId !== facultyProfile.id) {
      throw new ForbiddenException("You can only post assignments for your assigned courses");
    }

    return this.prisma.assignment.create({
      data: {
        courseAssignmentId: dto.courseAssignmentId,
        title: dto.title,
        instructions: dto.instructions,
        dueDate: new Date(dto.dueDate),
        attachmentUrl: dto.attachmentUrl,
      },
      include: this.includeRelations(),
    });
  }

  async findMine(userId: number) {
    const facultyProfile = await this.findFacultyProfile(userId);

    return this.prisma.assignment.findMany({
      where: {
        courseAssignment: {
          facultyProfileId: facultyProfile.id,
        },
      },
      include: this.includeRelations(),
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findAll() {
    return this.prisma.assignment.findMany({
      include: this.includeRelations(),
      orderBy: {
        createdAt: "desc",
      },
    });
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

    return this.prisma.assignment.findMany({
      where: {
        courseAssignment: {
          courseId: {
            in: await this.findEnrolledCourseIds(studentProfile.id),
          },
        },
      },
      include: this.includeRelations(),
      orderBy: {
        dueDate: "asc",
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

  private async findEnrolledCourseIds(studentProfileId: number) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        studentProfileId,
      },
      select: {
        courseId: true,
      },
    });

    return enrollments.map((enrollment) => enrollment.courseId);
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
    };
  }
}
