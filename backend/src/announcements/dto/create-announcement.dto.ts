import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateAnnouncementDto {
  @IsInt()
  courseAssignmentId!: number;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  message!: string;
}
