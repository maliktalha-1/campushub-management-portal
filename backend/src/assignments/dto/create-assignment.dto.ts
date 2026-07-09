import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAssignmentDto {
  @IsInt()
  courseAssignmentId!: number;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  instructions!: string;

  @IsDateString()
  dueDate!: string;

  @IsOptional()
  @IsString()
  attachmentUrl?: string;
}
