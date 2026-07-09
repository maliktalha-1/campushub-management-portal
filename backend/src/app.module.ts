import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { DepartmentsModule } from './departments/departments.module';
import { CoursesModule } from './courses/courses.module';
import { StudentsModule } from "./students/students.module";
import { FacultyModule } from "./faculty/faculty.module";
import { CourseAssignmentsModule } from "./course-assignments/course-assignments.module";
import { AssignmentsModule } from "./assignments/assignments.module";
import { AssignmentSubmissionsModule } from "./assignment-submissions/assignment-submissions.module";
import { AnnouncementsModule } from "./announcements/announcements.module";
import { AttendanceModule } from "./attendance/attendance.module";
import { EnrollmentsModule } from "./enrollments/enrollments.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    DepartmentsModule,
    CoursesModule,
    StudentsModule,
    FacultyModule,
    CourseAssignmentsModule,
    AssignmentsModule,
    AssignmentSubmissionsModule,
    AnnouncementsModule,
    AttendanceModule,
    EnrollmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
