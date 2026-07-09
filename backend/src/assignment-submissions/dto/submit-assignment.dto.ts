import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class SubmitAssignmentDto {
  @IsInt()
  assignmentId!: number;

  @IsNotEmpty()
  @IsUrl()
  submissionUrl!: string;

  @IsOptional()
  @IsString()
  comments?: string;
}
