import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ApiResult } from '../common/dto/api-response';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(dto: LoginDto) {
    try {
      let loggedUser: LoginResponseDto | null = null;

      if (dto.role === UserRole.Student) {
        const student = await this.prisma.student.findFirst({
          where: { email: dto.email, deletedAt: null },
        });

        if (student) {
          loggedUser = {
            id: student.id,
            email: student.email,
            name: student.name,
            surname: student.surname,
            role: UserRole.Student,
          };
        }
      }

      if (dto.role === UserRole.Teacher) {
        const teacher = await this.prisma.teacher.findFirst({
          where: { email: dto.email, deletedAt: null },
        });

        if (teacher) {
          loggedUser = {
            id: teacher.id,
            email: teacher.email,
            name: teacher.name,
            surname: teacher.surname,
            role: UserRole.Teacher,
          };
        }
      }

      if (dto.role === UserRole.Admin || dto.role === UserRole.Auxiliar) {
        const rolName = dto.role === UserRole.Admin ? 'admin' : 'auxiliar';
        const user = await this.prisma.user.findFirst({
          where: { usuario: dto.email, rol: rolName, deletedAt: null },
        });

        if (user) {
          loggedUser = {
            id: user.id,
            email: user.usuario,
            name: user.usuario,
            surname: user.rol,
            role: dto.role,
          };
        }
      }

      if (loggedUser) {
        return ApiResult.success(loggedUser, 'Inicio de sesión exitoso.', 200);
      }

      return ApiResult.failure('Correo electrónico inválido.', 401);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }
}
