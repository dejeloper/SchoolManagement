import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentResponseDto } from './dto/student-response.dto';
import { ApiResult } from '../common/dto/api-response';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    try {
      const students = await this.prisma.student.findMany({
        where: { deletedAt: null },
        orderBy: { id: 'asc' },
      });

      const data = students.map(this.toResponse);
      return ApiResult.success(
        data,
        data.length === 0 ? 'No hay estudiantes registrados.' : 'Estudiantes obtenidos exitosamente.',
        200,
      );
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async getById(id: number) {
    try {
      const student = await this.prisma.student.findFirst({
        where: { id, deletedAt: null },
      });

      if (!student) {
        return ApiResult.failure('Estudiante no encontrado.', 404);
      }

      return ApiResult.success(this.toResponse(student), 'Estudiante obtenido exitosamente.', 200);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async create(dto: CreateStudentDto) {
    try {
      const exists = await this.prisma.student.findUnique({
        where: { email: dto.email },
      });

      if (exists) {
        return ApiResult.failure('El correo ya existe.', 400);
      }

      const student = await this.prisma.student.create({
        data: {
          name: dto.name,
          surname: dto.surname,
          email: dto.email,
        },
      });

      return ApiResult.success(this.toResponse(student), 'Estudiante creado exitosamente.', 201);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async update(id: number, dto: UpdateStudentDto) {
    try {
      const student = await this.prisma.student.findFirst({
        where: { id, deletedAt: null },
      });

      if (!student) {
        return ApiResult.failure('Estudiante no encontrado.', 404);
      }

      const updated = await this.prisma.student.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.surname !== undefined && { surname: dto.surname }),
        },
      });

      return ApiResult.success(this.toResponse(updated), 'Estudiante actualizado exitosamente.', 200);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async softDelete(id: number) {
    try {
      const student = await this.prisma.student.findFirst({
        where: { id, deletedAt: null },
      });

      if (!student) {
        return ApiResult.failure('Estudiante no encontrado.', 404);
      }

      await this.prisma.student.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return ApiResult.successEmpty('Estudiante eliminado exitosamente.', 200);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  private toResponse(s: any): StudentResponseDto {
    return {
      id: s.id,
      name: s.name,
      surname: s.surname,
      email: s.email,
      fullName: `${s.name} ${s.surname}`,
    };
  }
}
