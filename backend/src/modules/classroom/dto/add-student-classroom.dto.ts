import { IsNumberString, IsNotEmpty } from 'class-validator';

export class AddStudentClassroomDto {
  @IsNotEmpty()
  @IsNumberString()
  studentId: string;

  @IsNotEmpty()
  @IsNumberString()
  classroomId: string;
}
