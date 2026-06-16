import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los estudiantes' })
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener estudiante por ID' })
  getById(@Param('id') id: string) {
    return this.service.getById(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un estudiante' })
  create(@Body() dto: CreateStudentDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un estudiante' })
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un estudiante (soft delete)' })
  delete(@Param('id') id: string) {
    return this.service.softDelete(+id);
  }
}
