import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, Role } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateFacultyDto } from "./dto/create-faculty.dto";
import { UpdateFacultyDto } from "./dto/update-faculty.dto";

@Injectable()
export class FacultyService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFacultyDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.role !== Role.FACULTY) {
      throw new BadRequestException("Selected user must have FACULTY role");
    }

    try {
      return await this.prisma.facultyProfile.create({
        data: dto,
        include: this.includeRelations(),
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  findAll() {
    return this.prisma.facultyProfile.findMany({
      include: this.includeRelations(),
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: number) {
    const faculty = await this.prisma.facultyProfile.findUnique({
      where: { id },
      include: this.includeRelations(),
    });

    if (!faculty) {
      throw new NotFoundException("Faculty profile not found");
    }

    return faculty;
  }

  async update(id: number, dto: UpdateFacultyDto) {
    await this.findOne(id);

    try {
      return await this.prisma.facultyProfile.update({
        where: { id },
        data: dto,
        include: this.includeRelations(),
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.facultyProfile.delete({
      where: { id },
    });
  }

  private includeRelations() {
    return {
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
    };
  }

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictException("Faculty ID or user profile already exists");
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      throw new BadRequestException("Invalid department selected");
    }

    throw error;
  }
}
