import { Module } from "@nestjs/common";
import { AssignmentSubmissionsController } from "./assignment-submissions.controller";
import { AssignmentSubmissionsService } from "./assignment-submissions.service";

@Module({
  controllers: [AssignmentSubmissionsController],
  providers: [AssignmentSubmissionsService],
})
export class AssignmentSubmissionsModule {}
