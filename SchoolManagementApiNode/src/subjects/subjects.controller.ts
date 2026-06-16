import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly service: SubjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las materias' })
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener materia por ID' })
  getById(@Param('id') id: string) {
    return this.service.getById(+id);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'Obtener materias por profesor' })
  getByTeacherId(@Param('teacherId') teacherId: string) {
    return this.service.getByTeacherId(+teacherId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una materia' })
  create(@Body() dto: CreateSubjectDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una materia' })
  update(@Param('id') id: string, @Body() dto: UpdateSubjectDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una materia (soft delete)' })
  delete(@Param('id') id: string) {
    return this.service.softDelete(+id);
  }
}
