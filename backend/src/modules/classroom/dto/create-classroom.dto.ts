import { IsInt, Min, Max, IsString, Matches } from 'class-validator';

export class CreateClassroomDto {
  @IsString()
  classname: string;

  @IsInt()
  @Min(2000)
  @Max(2100)
  academicyear: number;

  @IsString()
  teacher: string;
}
