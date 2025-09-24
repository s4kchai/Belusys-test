import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from './student.entity';
@Entity('prefix')
export class Prefix {
  @PrimaryGeneratedColumn({ name: 'prefixid' })
  prefixId: number;

  @Column({ name: 'prefixname' })
  prefixName: string;

  @OneToMany(() => Student, (student) => student.prefix)
  students: Student[];
}
