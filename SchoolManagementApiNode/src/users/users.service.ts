import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiResult } from '../common/dto/api-response';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    try {
      const users = await this.prisma.user.findMany({
        where: { deletedAt: null },
        orderBy: { id: 'asc' },
      });

      const data = users.map(this.toResponse);
      return ApiResult.success(
        data,
        data.length === 0 ? 'No hay usuarios registrados.' : 'Usuarios obtenidos exitosamente.',
        200,
      );
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async getById(id: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id, deletedAt: null },
      });

      if (!user) {
        return ApiResult.failure('Usuario no encontrado.', 404);
      }

      return ApiResult.success(this.toResponse(user), 'Usuario obtenido exitosamente.', 200);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async create(dto: CreateUserDto) {
    try {
      const exists = await this.prisma.user.findUnique({
        where: { usuario: dto.usuario },
      });

      if (exists) {
        return ApiResult.failure('El usuario ya existe.', 400);
      }

      const user = await this.prisma.user.create({
        data: {
          usuario: dto.usuario,
          rol: dto.rol,
        },
      });

      return ApiResult.success(this.toResponse(user), 'Usuario creado exitosamente.', 201);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id, deletedAt: null },
      });

      if (!user) {
        return ApiResult.failure('Usuario no encontrado.', 404);
      }

      if (dto.usuario) {
        const exists = await this.prisma.user.findFirst({
          where: { usuario: dto.usuario, id: { not: id } },
        });
        if (exists) {
          return ApiResult.failure('El nombre de usuario ya está en uso.', 400);
        }
      }

      const data: any = {};
      if (dto.usuario !== undefined) data.usuario = dto.usuario;
      if (dto.rol !== undefined) data.rol = dto.rol;

      const updated = await this.prisma.user.update({
        where: { id },
        data,
      });

      return ApiResult.success(this.toResponse(updated), 'Usuario actualizado exitosamente.', 200);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async softDelete(id: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id, deletedAt: null },
      });

      if (!user) {
        return ApiResult.failure('Usuario no encontrado.', 404);
      }

      await this.prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return ApiResult.successEmpty('Usuario eliminado exitosamente.', 200);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  private toResponse(u: any): UserResponseDto {
    return {
      id: u.id,
      usuario: u.usuario,
      rol: u.rol,
      createdAt: u.createdAt,
    };
  }
}
