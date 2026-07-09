import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, Role } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateMyStudentDto } from "./dto/update-my-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.role !== Role.STUDENT) {
      throw new BadRequestException("Selected user must have STUDENT role");
    }

    try {
      return await this.prisma.studentProfile.create({
        data: {
          ...dto,
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        },
        include: this.includeRelations(),
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  findAll() {
    return this.prisma.studentProfile.findMany({
      include: this.includeRelations(),
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: number) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id },
      include: this.includeRelations(),
    });

    if (!student) {
      throw new NotFoundException("Student profile not found");
    }

    return student;
  }

  async findMine(userId: number) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { userId },
      include: this.includeRelations(),
    });

    if (!student) {
      throw new NotFoundException("Student profile not found");
    }

    return student;
  }

  async update(id: number, dto: UpdateStudentDto) {
    await this.findOne(id);

    try {
      return await this.prisma.studentProfile.update({
        where: { id },
        data: {
          ...dto,
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        },
        include: this.includeRelations(),
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateMine(userId: number, dto: UpdateMyStudentDto) {
    const student = await this.findMine(userId);

    return this.prisma.studentProfile.update({
      where: { id: student.id },
      data: {
        phone: dto.phone,
        address: dto.address,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      },
      include: this.includeRelations(),
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.studentProfile.delete({
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
      throw new ConflictException("Student ID or user profile already exists");
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