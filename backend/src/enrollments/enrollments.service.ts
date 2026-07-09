import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEnrollmentDto) {
    const [studentProfile, course] = await Promise.all([
      this.prisma.studentProfile.findUnique({
        where: { id: dto.studentProfileId },
      }),
      this.prisma.course.findUnique({
        where: { id: dto.courseId },
      }),
    ]);

    if (!studentProfile) {
      throw new NotFoundException("Student profile not found");
    }

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    try {
      return await this.prisma.enrollment.create({
        data: dto,
        include: this.includeRelations(),
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  findAll() {
    return this.prisma.enrollment.findMany({
      include: this.includeRelations(),
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findMyCourses(userId: number) {
    const studentProfile = await this.prisma.studentProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!studentProfile) {
      throw new NotFoundException("Student profile not found");
    }

    return this.prisma.enrollment.findMany({
      where: {
        studentProfileId: studentProfile.id,
      },
      include: this.courseOnlyRelations(),
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async remove(id: number) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });

    if (!enrollment) {
      throw new NotFoundException("Enrollment not found");
    }

    return this.prisma.enrollment.delete({
      where: { id },
    });
  }

  private includeRelations() {
    return {
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
          department: true,
        },
      },
      course: {
        include: {
          department: true,
          assignments: {
            include: {
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
        },
      },
    };
  }

  private courseOnlyRelations() {
    return {
      course: {
        include: {
          department: true,
          assignments: {
            include: {
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
        },
      },
    };
  }

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictException("Student is already enrolled in this course");
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      throw new BadRequestException("Invalid student profile or course selected");
    }

    throw error;
  }
}
