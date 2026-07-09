import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { AnnouncementsService } from "./announcements.service";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";

@Controller("announcements")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Roles("FACULTY")
  @Post()
  create(
    @Req() req: { user: { id: number } },
    @Body() dto: CreateAnnouncementDto,
  ) {
    return this.announcementsService.createForFaculty(req.user.id, dto);
  }

  @Roles("FACULTY")
  @Get("my")
  findMineForFaculty(@Req() req: { user: { id: number } }) {
    return this.announcementsService.findMineForFaculty(req.user.id);
  }

  @Roles("STUDENT")
  @Get("student/my")
  findForStudent(@Req() req: { user: { id: number } }) {
    return this.announcementsService.findForStudent(req.user.id);
  }

  @Roles("ADMIN")
  @Get()
  findAll() {
    return this.announcementsService.findAll();
  }
}
