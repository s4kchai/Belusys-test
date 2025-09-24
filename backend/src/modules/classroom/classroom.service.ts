import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { SearchClassroomDto } from '../classroom/dto/search-classroom.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Classroom, StudentClassroom, Student, Prefix } from '../../entities';
import { AddStudentClassroomDto } from './dto/add-student-classroom.dto';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(Classroom)
    private readonly classRoomRepository: Repository<Classroom>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(StudentClassroom)
    private readonly studentClassroomRepository: Repository<StudentClassroom>,
  ) {}

  async findAll(dto: SearchClassroomDto): Promise<Classroom[]> {
    const { search } = dto;
    if (!search) {
      return await this.classRoomRepository.find();
    }
    const query = await this.classRoomRepository
      .createQueryBuilder('classroom')
      .where('classroom.teacher LIKE :search', { search: `%${search}%` })
      .orWhere('classroom.classname LIKE :search', { search: `%${search}%` })
      .orWhere('classroom.academicYear LIKE :search', { search: `%${search}%` })
      .orWhere('classroom.classroomid LIKE :search', { search: `%${search}%` })
      .getMany();
    return query;
  }

  async create(dto: CreateClassroomDto): Promise<Classroom> {
    const classroom = this.classRoomRepository.create(dto);
    return await this.classRoomRepository.save(classroom);
  }

  async addStudentToClass(
    dto: AddStudentClassroomDto,
  ): Promise<{ success: boolean }> {
    const { studentId, classroomId } = dto;

    const classroom = await this.classRoomRepository.findOne({
      where: { classroomid: parseInt(classroomId) },
      relations: ['studentClassrooms', 'studentClassrooms.student'],
    });
    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${classroomId} not found`);
    }
    const student = await this.studentRepository.findOne({
      where: { studentId: parseInt(studentId) },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const chackInclass = await this.studentClassroomRepository.findOne({
      where: { student: { studentId: student.studentId } },
      relations: ['classroom'],
    });

    if (chackInclass) {
      throw new ConflictException(
        `Student with ID ${studentId} is already in classroom ${chackInclass.classroom.classroomid}`,
      );
    }
    const newStudentClass = this.studentClassroomRepository.create({
      student,
      classroom,
    });
    await this.studentClassroomRepository.save(newStudentClass);
    return { success: true };
  }

  async removeStudentFromClassroom(
    classroomId: number,
    studentId: number,
  ): Promise<{ success: boolean }> {
    const enrollment = await this.studentClassroomRepository.findOne({
      where: {
        classroom: { classroomid: classroomId },
        student: { studentId },
      },
    });

    if (!enrollment) {
      throw new NotFoundException(
        `Not found student id : ${studentId} in class  :  ${classroomId}`,
      );
    }

    await this.studentClassroomRepository.delete(
      enrollment.student_classroom_id,
    );
    return { success: true };
  }

  async update(id: number, dto: UpdateClassroomDto): Promise<Classroom> {
    const classroom = await this.classRoomRepository.findOne({
      where: { classroomid: id },
    });
    if (!classroom) {
      throw new NotFoundException(`Classroom ${id} not found`);
    }
    Object.assign(classroom, dto);
    return this.classRoomRepository.save(classroom);
  }

  async findOne(id: number): Promise<Classroom> {
    const result = await this.classRoomRepository.findOne({
      where: { classroomid: id },
      relations: [
        'studentClassrooms',
        'studentClassrooms.student',
        'studentClassrooms.student.prefix',
      ],
    });
    if (!result) {
      throw new NotFoundException(`Not found class id : ${id}`);
    }
    return result;
  }

  async remove(id: number): Promise<{ success: boolean }> {
    const classroom = await this.classRoomRepository.findOne({
      where: { classroomid: id },
      relations: ['studentClassrooms'],
    });

    if (!classroom) {
      throw new NotFoundException(`Not found class id : ${id}`);
    }

    if (classroom.studentClassrooms.length > 0) {
      throw new BadRequestException('This classroom has students');
    }

    await this.classRoomRepository.delete({ classroomid: id });
    return { success: true };
  }
}
