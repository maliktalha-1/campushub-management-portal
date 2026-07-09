import { IsInt } from "class-validator";

export class CreateEnrollmentDto {
  @IsInt()
  studentProfileId!: number;

  @IsInt()
  courseId!: number;
}
