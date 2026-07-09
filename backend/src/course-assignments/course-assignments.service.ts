import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCourseAssignmentDto } from "./dto/create-course-assignment.dto";

@Injectable()
export class CourseAssignmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCourseAssignmentDto) {
    const [facultyProfile, course] = await Promise.all([
      this.prisma.facultyProfile.findUnique({
        where: { id: dto.facultyProfileId },
      }),
      this.prisma.course.findUnique({
        where: { id: dto.courseId },
      }),
    ]);

    if (!facultyProfile) {
      throw new NotFoundException("Faculty profile not found");
    }

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    try {
      return await this.prisma.courseAssignment.create({
        data: dto,
        include: this.includeRelations(),
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  findAll() {
    return this.prisma.courseAssignment.findMany({
      include: this.includeRelations(),
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  findByFaculty(facultyProfileId: number) {
    return this.prisma.courseAssignment.findMany({
      where: {
        facultyProfileId,
      },
      include: this.includeRelations(),
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findMyCourses(userId: number) {
    const facultyProfile = await this.prisma.facultyProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!facultyProfile) {
      throw new NotFoundException("Faculty profile not found");
    }

    return this.findByFaculty(facultyProfile.id);
  }

  async remove(id: number) {
    const assignment = await this.prisma.courseAssignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException("Course assignment not found");
    }

    return this.prisma.courseAssignment.delete({
      where: { id },
    });
  }

  private includeRelations() {
    return {
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
          department: true,
        },
      },
      course: {
        include: {
          department: true,
        },
      },
    };
  }

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictException("Faculty is already assigned to this course");
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      throw new BadRequestException("Invalid faculty profile or course selected");
    }

    throw error;
  }
}
