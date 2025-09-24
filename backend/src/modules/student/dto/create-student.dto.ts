import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  prefixId: number;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  genderid: number;

  @IsNotEmpty()
  birthDate: Date;

  @IsNotEmpty()
  gradelevelid: number;
}
