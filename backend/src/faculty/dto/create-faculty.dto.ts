import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateFacultyDto {
  @IsInt()
  userId!: number;

  @IsInt()
  departmentId!: number;

  @IsNotEmpty()
  @IsString()
  facultyId!: string;

  @IsNotEmpty()
  @IsString()
  designation!: string;

  @IsOptional()
  @IsString()
  qualification?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  officeLocation?: string;
}
