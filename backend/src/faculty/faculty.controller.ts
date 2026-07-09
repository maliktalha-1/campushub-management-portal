import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { CreateFacultyDto } from "./dto/create-faculty.dto";
import { UpdateFacultyDto } from "./dto/update-faculty.dto";
import { FacultyService } from "./faculty.service";

@Controller("faculty")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Post()
  create(@Body() dto: CreateFacultyDto) {
    return this.facultyService.create(dto);
  }

  @Get()
  findAll() {
    return this.facultyService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.facultyService.findOne(Number(id));
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateFacultyDto) {
    return this.facultyService.update(Number(id), dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.facultyService.remove(Number(id));
  }
}
