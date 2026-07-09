import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateMyStudentDto } from "./dto/update-my-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { StudentsService } from "./students.service";

@Controller("students")
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Roles("ADMIN")
  @Post()
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Roles("ADMIN")
  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Roles("STUDENT")
  @Get("me")
  findMine(@Req() req: { user: { id: number } }) {
    return this.studentsService.findMine(req.user.id);
  }

  @Roles("STUDENT")
  @Patch("me")
  updateMine(
    @Req() req: { user: { id: number } },
    @Body() dto: UpdateMyStudentDto,
  ) {
    return this.studentsService.updateMine(req.user.id, dto);
  }

  @Roles("ADMIN")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.studentsService.findOne(Number(id));
  }

  @Roles("ADMIN")
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(Number(id), dto);
  }

  @Roles("ADMIN")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.studentsService.remove(Number(id));
  }
}
