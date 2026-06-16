import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { SubjectsModule } from './subjects/subjects.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    StudentsModule,
    TeachersModule,
    SubjectsModule,
    EnrollmentsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
