import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Classroom } from './classroom.entity';

@Entity('student_classroom')
export class StudentClassroom {
  @PrimaryGeneratedColumn()
  student_classroom_id: number;

  @Column()
  studentid: number;

  @Column()
  classroomid: number;

  @ManyToOne(() => Student, (Classroom) => Classroom.studentClassrooms)
  @JoinColumn({ name: 'studentid' })
  student: Student;

  @ManyToOne(() => Classroom)
  @JoinColumn({ name: 'classroomid' })
  classroom: Classroom;
}
