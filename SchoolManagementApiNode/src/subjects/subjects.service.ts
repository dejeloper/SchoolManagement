import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectResponseDto } from './dto/subject-response.dto';
import { ApiResult } from '../common/dto/api-response';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    try {
      const subjects = await this.prisma.subject.findMany({
        where: { deletedAt: null },
        include: { teacher: true },
        orderBy: { id: 'asc' },
      });

      const data = subjects.map(this.toResponse);
      return ApiResult.success(
        data,
        data.length === 0 ? 'No hay materias registradas.' : 'Materias obtenidas exitosamente.',
        200,
      );
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async getById(id: number) {
    try {
      const subject = await this.prisma.subject.findFirst({
        where: { id, deletedAt: null },
        include: { teacher: true },
      });

      if (!subject) {
        return ApiResult.failure('Materia no encontrada.', 404);
      }

      return ApiResult.success(this.toResponse(subject), 'Materia obtenida exitosamente.', 200);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async getByTeacherId(teacherId: number) {
    try {
      const subjects = await this.prisma.subject.findMany({
        where: { teacherId, deletedAt: null },
        include: { teacher: true },
      });

      const data = subjects.map(this.toResponse);
      return ApiResult.success(
        data,
        data.length === 0 ? 'No hay materias para este profesor.' : 'Materias obtenidas exitosamente.',
        200,
      );
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async create(dto: CreateSubjectDto) {
    try {
      const exists = await this.prisma.subject.findUnique({
        where: { name: dto.name },
      });

      if (exists) {
        return ApiResult.failure('La materia ya existe.', 400);
      }

      const teacher = await this.prisma.teacher.findFirst({
        where: { id: dto.teacherId, deletedAt: null },
      });

      if (!teacher) {
        return ApiResult.failure('El profesor no existe.', 404);
      }

      const subject = await this.prisma.subject.create({
        data: {
          name: dto.name,
          description: dto.description,
          credits: dto.credits,
          teacherId: dto.teacherId,
        },
        include: { teacher: true },
      });

      return ApiResult.success(this.toResponse(subject), 'Materia creada exitosamente.', 201);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async update(id: number, dto: UpdateSubjectDto) {
    try {
      const subject = await this.prisma.subject.findFirst({
        where: { id, deletedAt: null },
      });

      if (!subject) {
        return ApiResult.failure('Materia no encontrada.', 404);
      }

      const data: any = {};
      if (dto.name !== undefined) data.name = dto.name;
      if (dto.description !== undefined) data.description = dto.description;
      if (dto.teacherId !== undefined) {
        const teacher = await this.prisma.teacher.findFirst({
          where: { id: dto.teacherId, deletedAt: null },
        });
        if (!teacher) {
          return ApiResult.failure('El profesor no existe.', 404);
        }
        data.teacherId = dto.teacherId;
      }
      if (dto.credits !== undefined) data.credits = dto.credits;

      const updated = await this.prisma.subject.update({
        where: { id },
        data,
        include: { teacher: true },
      });

      return ApiResult.success(this.toResponse(updated), 'Materia actualizada exitosamente.', 200);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async softDelete(id: number) {
    try {
      const subject = await this.prisma.subject.findFirst({
        where: { id, deletedAt: null },
      });

      if (!subject) {
        return ApiResult.failure('Materia no encontrada.', 404);
      }

      await this.prisma.subject.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return ApiResult.successEmpty('Materia eliminada exitosamente.', 200);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  private toResponse(s: any): SubjectResponseDto {
    return {
      id: s.id,
      name: s.name,
      description: s.description,
      credits: s.credits,
      teacherId: s.teacherId,
      teacherName: s.teacher?.name ?? 'Desconocido',
    };
  }
}
