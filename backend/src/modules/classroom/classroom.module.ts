import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classroom, StudentClassroom, Student } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Classroom, Student, StudentClassroom])],
  controllers: [ClassroomController],
  providers: [ClassroomService],
})
export class ClassroomModule {}
