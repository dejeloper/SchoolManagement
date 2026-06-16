import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@ApiTags('Teachers')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly service: TeachersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los profesores' })
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener profesor por ID' })
  getById(@Param('id') id: string) {
    return this.service.getById(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un profesor' })
  create(@Body() dto: CreateTeacherDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un profesor' })
  update(@Param('id') id: string, @Body() dto: UpdateTeacherDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un profesor (soft delete)' })
  delete(@Param('id') id: string) {
    return this.service.softDelete(+id);
  }
}
