import { IsInt, IsNotEmpty, Min } from "class-validator";

export class CreateCourseDto {
  @IsNotEmpty()
  code!: string;

  @IsNotEmpty()
  title!: string;

  @IsInt()
  @Min(1)
  creditHours!: number;

  @IsInt()
  departmentId!: number;
}