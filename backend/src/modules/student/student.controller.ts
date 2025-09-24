import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { SearchStudentDto } from './dto/search-student.dto';
import { StatusCodes } from 'http-status-codes';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @HttpCode(StatusCodes.OK)
  async search(@Query() dto: SearchStudentDto) {
    const students = await this.studentService.search(dto);
    return {
      success: true,
      message: 'Students search successfully',
      data: students,
    };
  }

  @Get('form-data')
  async getFormData() {
    const data = await this.studentService.getFormOptions();
    return {
      success: true,
      message: 'Form data retrieved successfully',
      data: data,
    };
  }
  @Get(':id')
  async getStudent(@Param('id') id: string) {
    const student = await this.studentService.findOne(+id);
    return {
      success: true,
      message: 'Student retrieved successfully',
      data: student,
    };
  }

  @Post()
  @HttpCode(StatusCodes.CREATED)
  async create(@Body() dto: CreateStudentDto) {
    const student = await this.studentService.create(dto);
    return {
      success: true,
      message: 'Student created successfully',
      data: student,
    };
  }

  @Patch(':id')
  @HttpCode(StatusCodes.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    const updated = await this.studentService.update(+id, dto);
    return {
      success: true,
      message: 'Student updated successfully',
      data: updated,
    };
  }

  @Delete(':id')
  @HttpCode(StatusCodes.OK)
  async remove(@Param('id') id: string) {
    const remove = await this.studentService.remove(+id);
    return {
      success: true,
      message: 'Student removed successfully',
    };
  }
}
