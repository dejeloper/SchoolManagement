import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherResponseDto } from './dto/teacher-response.dto';
import { ApiResult } from '../common/dto/api-response';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    try {
      const teachers = await this.prisma.teacher.findMany({
        where: { deletedAt: null },
        orderBy: { id: 'asc' },
      });

      const data = teachers.map(this.toResponse);
      return ApiResult.success(
        data,
        data.length === 0 ? 'No hay profesores registrados.' : 'Profesores obtenidos exitosamente.',
        200,
      );
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async getById(id: number) {
    try {
      const teacher = await this.prisma.teacher.findFirst({
        where: { id, deletedAt: null },
      });

      if (!teacher) {
        return ApiResult.failure('Profesor no encontrado.', 404);
      }

      return ApiResult.success(this.toResponse(teacher), 'Profesor obtenido exitosamente.', 200);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async create(dto: CreateTeacherDto) {
    try {
      const exists = await this.prisma.teacher.findUnique({
        where: { email: dto.email },
      });

      if (exists) {
        return ApiResult.failure('El correo ya existe.', 400);
      }

      const teacher = await this.prisma.teacher.create({
        data: {
          name: dto.name,
          surname: dto.surname,
          email: dto.email,
        },
      });

      return ApiResult.success(this.toResponse(teacher), 'Profesor creado exitosamente.', 201);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async update(id: number, dto: UpdateTeacherDto) {
    try {
      const teacher = await this.prisma.teacher.findFirst({
        where: { id, deletedAt: null },
      });

      if (!teacher) {
        return ApiResult.failure('Profesor no encontrado.', 404);
      }

      const updated = await this.prisma.teacher.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.surname !== undefined && { surname: dto.surname }),
        },
      });

      return ApiResult.success(this.toResponse(updated), 'Profesor actualizado exitosamente.', 200);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async softDelete(id: number) {
    try {
      const teacher = await this.prisma.teacher.findFirst({
        where: { id, deletedAt: null },
      });

      if (!teacher) {
        return ApiResult.failure('Profesor no encontrado.', 404);
      }

      await this.prisma.teacher.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return ApiResult.successEmpty('Profesor eliminado exitosamente.', 200);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  private toResponse(t: any): TeacherResponseDto {
    return {
      id: t.id,
      name: t.name,
      surname: t.surname,
      email: t.email,
      fullName: `${t.name} ${t.surname}`,
    };
  }
}
