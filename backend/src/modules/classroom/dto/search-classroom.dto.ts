import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class SearchClassroomDto {
  @IsOptional()
  @IsString()
  search?: string;
}
