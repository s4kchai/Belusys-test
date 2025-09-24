import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from './student.entity';

@Entity('gradelevel')
export class gradeLevel {
  @PrimaryGeneratedColumn()
  gradelevelid: number;

  @Column()
  levelname: string;

  @OneToMany(() => Student, (student) => student.gradelevel)
  students: Student[];
}
