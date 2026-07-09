import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { AttendanceService } from "./attendance.service";
import { MarkAttendanceDto } from "./dto/mark-attendance.dto";

@Controller("attendance")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Roles("FACULTY")
  @Get("faculty/course/:courseAssignmentId")
  getCourseRoster(
    @Req() req: { user: { id: number } },
    @Param("courseAssignmentId") courseAssignmentId: string,
    @Query("date") date: string,
  ) {
    return this.attendanceService.getCourseRoster(
      req.user.id,
      Number(courseAssignmentId),
      date,
    );
  }

  @Roles("FACULTY")
  @Post("faculty")
  markForFaculty(
    @Req() req: { user: { id: number } },
    @Body() dto: MarkAttendanceDto,
  ) {
    return this.attendanceService.markForFaculty(req.user.id, dto);
  }

  @Roles("STUDENT")
  @Get("student/my")
  findForStudent(@Req() req: { user: { id: number } }) {
    return this.attendanceService.findForStudent(req.user.id);
  }
}
