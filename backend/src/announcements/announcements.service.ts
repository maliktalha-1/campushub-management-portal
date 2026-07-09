import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async createForFaculty(userId: number, dto: CreateAnnouncementDto) {
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
      throw new ForbiddenException(
        "You can only post announcements for your assigned courses",
      );
    }

    return this.prisma.announcement.create({
      data: dto,
      include: this.includeRelations(),
    });
  }

  async findMineForFaculty(userId: number) {
    const facultyProfile = await this.findFacultyProfile(userId);

    return this.prisma.announcement.findMany({
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

  async findForStudent(userId: number) {
    const studentProfile = await this.prisma.studentProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!studentProfile) {
      throw new NotFoundException("Student profile not found");
    }

    return this.prisma.announcement.findMany({
      where: {
        courseAssignment: {
          courseId: {
            in: await this.findEnrolledCourseIds(studentProfile.id),
          },
        },
      },
      include: this.includeRelations(),
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findAll() {
    return this.prisma.announcement.findMany({
      include: this.includeRelations(),
      orderBy: {
        createdAt: "desc",
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
