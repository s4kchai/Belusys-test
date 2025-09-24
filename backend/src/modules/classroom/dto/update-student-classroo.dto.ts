import { PartialType } from '@nestjs/mapped-types';
import { AddStudentClassroomDto } from './add-student-classroom.dto';

export class UpdateClassroomDto extends PartialType(AddStudentClassroomDto) {}
