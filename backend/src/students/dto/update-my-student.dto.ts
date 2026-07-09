import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateMyStudentDto {
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
