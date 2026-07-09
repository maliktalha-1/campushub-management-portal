import {
  Body,
  Controller,
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
import { AssignmentSubmissionsService } from "./assignment-submissions.service";
import { SubmitAssignmentDto } from "./dto/submit-assignment.dto";
import { GradeSubmissionDto } from "./dto/grade-submission.dto";

@Controller("assignment-submissions")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentSubmissionsController {
  constructor(
    private readonly assignmentSubmissionsService: AssignmentSubmissionsService,
  ) {}

  @Roles("STUDENT")
  @Post()
  submit(
    @Req() req: { user: { id: number } },
    @Body() dto: SubmitAssignmentDto,
  ) {
    return this.assignmentSubmissionsService.submit(req.user.id, dto);
  }

  @Roles("STUDENT")
  @Get("my")
  findMine(@Req() req: { user: { id: number } }) {
    return this.assignmentSubmissionsService.findMine(req.user.id);
  }

  @Roles("FACULTY")
  @Get("faculty/my")
  findForFaculty(@Req() req: { user: { id: number } }) {
    return this.assignmentSubmissionsService.findForFaculty(req.user.id);
  }

  @Roles("FACULTY")
  @Patch(":id/grade")
  gradeSubmission(
    @Param("id") id: string,
    @Req() req: { user: { id: number } },
    @Body() dto: GradeSubmissionDto,
  ) {
    return this.assignmentSubmissionsService.gradeSubmission(
      Number(id),
      req.user.id,
      dto,
    );
  }
}