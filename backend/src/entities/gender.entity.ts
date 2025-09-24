import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from './student.entity';
@Entity('gender')
export class Gender {
  @PrimaryGeneratedColumn()
  genderid: number;

  @Column()
  gendername: string;

  @OneToMany(() => Student, (student) => student.gender)
  students: Student[];
}
