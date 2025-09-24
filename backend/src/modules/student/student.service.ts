import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import {
  Student,
  Prefix,
  gradeLevel,
  Gender,
  Classroom,
  StudentClassroom,
} from '../../entities';
import { SearchStudentDto } from './dto/search-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Prefix)
    private prefixRepo: Repository<Prefix>,
    @InjectRepository(gradeLevel)
    private gradeLevelRepo: Repository<gradeLevel>,
    @InjectRepository(Gender)
    private genderRepo: Repository<Gender>,
    @InjectRepository(Classroom)
    private classroomRepo: Repository<Classroom>,
  ) {}

  async search(dto: SearchStudentDto): Promise<Student[]> {
    const { studentId, name, gradeLevel } = dto;
    const query = this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.prefix', 'prefix')
      .leftJoinAndSelect('student.gradelevel', 'gradelevel')
      .leftJoinAndSelect('student.gender', 'genderid');

    return await query.getMany();
  }

  async create(dto: CreateStudentDto) {
    const student = this.studentRepository.create(dto);
    return await this.studentRepository.save(student);
  }

  async findOne(studentId: number): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { studentId },
      relations: ['prefix', 'gradelevel', 'gender', 'studentClassrooms'],
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return student;
  }

  async update(id: number, dto: UpdateStudentDto) {
    const student = await this.studentRepository.findOne({
      where: { studentId: id },
    });
    if (!student) throw new NotFoundException('Student not found');

    const updatedStudent = Object.assign(student, dto);
    return await this.studentRepository.save(updatedStudent);
  }

  async remove(id: number) {
    const student = await this.studentRepository.findOne({
      where: { studentId: id },
    });
    if (!student) throw new NotFoundException('Student not found');
    return await this.studentRepository.remove(student);
  }
  async getFormOptions() {
    const prefixes = await this.prefixRepo.find();
    const gender = await this.genderRepo.find();
    const gradeLevels = await this.gradeLevelRepo.find();
    const classrooms = await this.classroomRepo.find();
    return { prefixes, gender, gradeLevels, classrooms };
  }
}
