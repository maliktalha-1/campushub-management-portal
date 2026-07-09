import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateCourseAssignmentDto {
  @IsInt()
  facultyProfileId!: number;

  @IsInt()
  courseId!: number;

  @IsNotEmpty()
  @IsString()
  semester!: string;
}
