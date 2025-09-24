import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Prefix } from './prefix.entity';
import { gradeLevel } from './gradelevel.entity';
import { Gender } from './gender.entity';
import { StudentClassroom } from './student_classroom.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  studentId: number;

  @Column({ name: 'prefixid' })
  prefixId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  genderid: number;

  @Column()
  birthDate: Date;

  @Column()
  gradelevelid: number;

  @ManyToOne(() => Prefix, (prefix) => prefix.students)
  @JoinColumn({ name: 'prefixid' })
  prefix: Prefix;

  @ManyToOne(() => gradeLevel, (gradelevel) => gradelevel.students)
  @JoinColumn({ name: 'gradelevelid' })
  gradelevel: gradeLevel;

  @ManyToOne(() => Gender, (gender) => gender.genderid)
  @JoinColumn({ name: 'genderid' })
  gender: Gender;

  @OneToMany(() => StudentClassroom, (sc) => sc.student)
  studentClassrooms: StudentClassroom[];
}
