import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateStudentDto {
  @IsInt()
  userId!: number;

  @IsInt()
  departmentId!: number;

  @IsNotEmpty()
  @IsString()
  studentId!: string;

  @IsInt()
  @Min(1)
  semester!: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}
