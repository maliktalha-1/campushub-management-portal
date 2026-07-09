import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCourseDto } from "./dto/create-course.dto";

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: dto,
      include: {
        department: true,
      },
    });
  }

  findAll() {
    return this.prisma.course.findMany({
      include: {
        department: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}