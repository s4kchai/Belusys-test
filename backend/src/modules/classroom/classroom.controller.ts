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
import { ClassroomService } from './classroom.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { SearchClassroomDto } from './dto/search-classroom.dto';
import { StatusCodes } from 'http-status-codes';
import { AddStudentClassroomDto } from './dto/add-student-classroom.dto';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  //   @Get('form-data')
  //   async getFormData() {
  //     return this.studentService.getFormData();
  //   }
  @Get()
  @HttpCode(StatusCodes.OK)
  async findAll(@Query() dto: SearchClassroomDto) {
    const classRoom = await this.classroomService.findAll(dto);
    return {
      success: true,
      message: 'Classroom search successfully',
      data: classRoom,
    };
  }

  @Get(':id')
  @HttpCode(StatusCodes.OK)
  async findOne(@Param('id') id: string) {
    const classRoom = await this.classroomService.findOne(+id);
    return {
      success: true,
      message: 'Classroom search successfully',
      data: classRoom,
    };
  }

  @Post()
  @HttpCode(StatusCodes.CREATED)
  async create(@Body() dto: CreateClassroomDto) {
    const classroom = await this.classroomService.create(dto);
    return {
      success: true,
      message: 'Classroom created successfully',
      data: classroom,
    };
  }

  // add student to class
  @Post(':classroomId/students/:studentId')
  @HttpCode(StatusCodes.OK)
  async addStudentToClass(
    @Param('classroomId') classroomId: string,
    @Param('studentId') studentId: string,
  ) {
    const dto: AddStudentClassroomDto = {
      classroomId,
      studentId,
    };
    await this.classroomService.addStudentToClass(dto);
    return {
      success: true,
      message: 'Add to class successfully',
      data: [],
    };
  }

  // remove student from class
  @Delete(':classroomId/students/:studentId')
  @HttpCode(StatusCodes.OK)
  async removeStudentFromClassroom(
    @Param('classroomId') classroomId: string,
    @Param('studentId') studentId: string,
  ) {
    await this.classroomService.removeStudentFromClassroom(
      +classroomId,
      +studentId,
    );
    return {
      success: true,
      message: 'Remove from class successfully',
      data: [],
    };
  }

  @Patch(':id')
  @HttpCode(StatusCodes.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateClassroomDto) {
    const updated = await this.classroomService.update(+id, dto);
    return {
      success: true,
      message: 'Classroom updated successfully',
      data: updated,
    };
  }

  @Delete(':id')
  @HttpCode(StatusCodes.OK)
  async remove(@Param('id') id: string) {
    await this.classroomService.remove(+id);
    return {
      success: true,
      message: 'Classroom removed successfully',
      data: [],
    };
  }
}
