import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.provider';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './modules/student/student.module';
import { ClassroomModule } from './modules/classroom/classroom.module';
@Module({
  imports: [
    StudentModule,
    ClassroomModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(databaseConfig),
  ],
})
export class AppModule {}
