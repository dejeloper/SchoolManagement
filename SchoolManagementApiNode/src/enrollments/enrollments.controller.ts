import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly service: EnrollmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las inscripciones' })
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener inscripción por ID' })
  getById(@Param('id') id: string) {
    return this.service.getById(+id);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Obtener inscripciones por estudiante' })
  getByStudentId(@Param('studentId') studentId: string) {
    return this.service.getByStudentId(+studentId);
  }

  @Get('student/:studentId/classmates')
  @ApiOperation({ summary: 'Obtener compañeros de clase' })
  getClassmates(@Param('studentId') studentId: string) {
    return this.service.getClassmates(+studentId);
  }

  @Get('student/:studentId/academic-record')
  @ApiOperation({ summary: 'Obtener historial académico del estudiante' })
  getAcademicRecord(@Param('studentId') studentId: string) {
    return this.service.getStudentAcademicRecord(+studentId);
  }

  @Get('subject/:subjectId')
  @ApiOperation({ summary: 'Obtener inscripciones por materia' })
  getBySubjectId(@Param('subjectId') subjectId: string) {
    return this.service.getBySubjectId(+subjectId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una inscripción' })
  create(@Body() dto: CreateEnrollmentDto) {
    return this.service.create(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una inscripción (soft delete)' })
  delete(@Param('id') id: string) {
    return this.service.softDelete(+id);
  }
}
