import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class SearchStudentDto {
  @IsOptional()
  @IsNumberString()
  studentId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  gradeLevel?: string;
}
