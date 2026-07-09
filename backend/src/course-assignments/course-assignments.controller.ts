import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { CourseAssignmentsService } from "./course-assignments.service";
import { CreateCourseAssignmentDto } from "./dto/create-course-assignment.dto";

@Controller("course-assignments")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseAssignmentsController {
  constructor(
    private readonly courseAssignmentsService: CourseAssignmentsService,
  ) {}

  @Roles("ADMIN")
  @Post()
  create(@Body() dto: CreateCourseAssignmentDto) {
    return this.courseAssignmentsService.create(dto);
  }

  @Roles("ADMIN")
  @Get()
  findAll() {
    return this.courseAssignmentsService.findAll();
  }

  @Roles("ADMIN", "FACULTY")
  @Get("my-courses")
  findMyCourses(@Req() req: { user: { id: number } }) {
    return this.courseAssignmentsService.findMyCourses(req.user.id);
  }

  @Roles("ADMIN", "FACULTY")
  @Get("faculty/:facultyProfileId")
  findByFaculty(@Param("facultyProfileId") facultyProfileId: string) {
    return this.courseAssignmentsService.findByFaculty(Number(facultyProfileId));
  }

  @Roles("ADMIN")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.courseAssignmentsService.remove(Number(id));
  }
}
