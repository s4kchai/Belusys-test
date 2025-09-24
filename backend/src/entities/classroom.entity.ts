import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { StudentClassroom } from './student_classroom.entity';
@Entity('classroom')
export class Classroom {
  @PrimaryGeneratedColumn()
  classroomid: number;

  @Column()
  classname: string;

  @Column({ name: 'academic_year' })
  academicyear: number;

  @Column({ name: 'homeroom_teacher' })
  teacher: string;

  @OneToMany(() => StudentClassroom, (sc) => sc.classroom)
  studentClassrooms: StudentClassroom[];
}
