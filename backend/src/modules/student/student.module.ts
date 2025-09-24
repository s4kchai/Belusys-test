import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Student, Prefix, gradeLevel, Gender, Classroom } from '../../entities';
@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Prefix, gradeLevel, Gender, Classroom]),
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
