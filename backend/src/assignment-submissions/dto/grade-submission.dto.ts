import { IsOptional, IsString } from "class-validator";

export class GradeSubmissionDto {
  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsString()
  feedback?: string;
}