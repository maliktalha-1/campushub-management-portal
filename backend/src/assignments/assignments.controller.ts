import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { AssignmentsService } from "./assignments.service";
import { CreateAssignmentDto } from "./dto/create-assignment.dto";

@Controller("assignments")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Roles("FACULTY")
  @Post()
  create(
    @Req() req: { user: { id: number } },
    @Body() dto: CreateAssignmentDto,
  ) {
    return this.assignmentsService.createForFaculty(req.user.id, dto);
  }

  @Roles("FACULTY")
  @Get("my")
  findMine(@Req() req: { user: { id: number } }) {
    return this.assignmentsService.findMine(req.user.id);
  }

  @Roles("STUDENT")
  @Get("student/my")
  findForStudent(@Req() req: { user: { id: number } }) {
    return this.assignmentsService.findForStudent(req.user.id);
  }

  @Roles("ADMIN")
  @Get()
  findAll() {
    return this.assignmentsService.findAll();
  }
}
