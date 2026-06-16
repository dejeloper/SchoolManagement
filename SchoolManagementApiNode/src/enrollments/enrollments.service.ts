import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentResponseDto } from './dto/enrollment-response.dto';
import { ClassmatesBySubjectDto } from './dto/classmates-by-subject.dto';
import { StudentAcademicRecordDto } from './dto/student-academic-record.dto';
import { ApiResult } from '../common/dto/api-response';

const MAX_CREDITS_PER_STUDENT = 9;

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    try {
      const enrollments = await this.prisma.enrollment.findMany({
        include: { student: true, subject: true },
        orderBy: { id: 'asc' },
      });

      const data = enrollments.map(this.toResponse);
      return ApiResult.success(
        data,
        data.length === 0 ? 'No hay inscripciones.' : 'Inscripciones obtenidas exitosamente.',
        200,
      );
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async getById(id: number) {
    try {
      const enrollment = await this.prisma.enrollment.findFirst({
        where: { id },
        include: { student: true, subject: true },
      });

      if (!enrollment) {
        return ApiResult.failure('Inscripción no encontrada.', 404);
      }

      return ApiResult.success(this.toResponse(enrollment), 'Inscripción obtenida exitosamente.', 200);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async getByStudentId(studentId: number) {
    try {
      const enrollments = await this.prisma.enrollment.findMany({
        where: { studentId },
        include: { student: true, subject: true },
      });

      const data = enrollments.map(this.toResponse);
      return ApiResult.success(
        data,
        data.length === 0 ? 'El estudiante no tiene inscripciones.' : 'Inscripciones obtenidas exitosamente.',
        200,
      );
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async getBySubjectId(subjectId: number) {
    try {
      const enrollments = await this.prisma.enrollment.findMany({
        where: { subjectId },
        include: { student: true, subject: true },
      });

      const data = enrollments.map(this.toResponse);
      return ApiResult.success(
        data,
        data.length === 0 ? 'No hay inscripciones en esta materia.' : 'Inscripciones obtenidas exitosamente.',
        200,
      );
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async create(dto: CreateEnrollmentDto) {
    try {
      const student = await this.prisma.student.findFirst({
        where: { id: dto.studentId, deletedAt: null },
      });

      if (!student) {
        return ApiResult.failure('El estudiante no existe.', 404);
      }

      const subject = await this.prisma.subject.findFirst({
        where: { id: dto.subjectId, deletedAt: null },
      });

      if (!subject) {
        return ApiResult.failure('La materia no existe.', 404);
      }

      const totalCredits = await this.getStudentTotalCredits(dto.studentId);
      if (totalCredits + subject.credits > MAX_CREDITS_PER_STUDENT) {
        return ApiResult.failure(
          `El estudiante excedería el máximo de ${MAX_CREDITS_PER_STUDENT} créditos permitidos.`,
          400,
        );
      }

      const hasSameTeacher = await this.prisma.enrollment.findFirst({
        where: { studentId: dto.studentId, subject: { teacherId: subject.teacherId } },
        include: { subject: true },
      });

      if (hasSameTeacher) {
        return ApiResult.failure('El estudiante ya tiene una materia con este profesor.', 400);
      }

      const existingEnrollment = await this.prisma.enrollment.findUnique({
        where: { studentId_subjectId: { studentId: dto.studentId, subjectId: dto.subjectId } },
      });

      if (existingEnrollment?.deletedAt) {
        const restored = await this.prisma.enrollment.update({
          where: { id: existingEnrollment.id },
          data: { deletedAt: null },
          include: { student: true, subject: true },
        });

        return ApiResult.success(this.toResponse(restored), 'Inscripción restaurada exitosamente.', 200);
      }

      if (existingEnrollment) {
        return ApiResult.failure('El estudiante ya está inscrito en esta materia.', 400);
      }

      const enrollment = await this.prisma.enrollment.create({
        data: {
          studentId: dto.studentId,
          subjectId: dto.subjectId,
        },
        include: { student: true, subject: true },
      });

      return ApiResult.success(this.toResponse(enrollment), 'Inscripción creada exitosamente.', 201);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async getClassmates(studentId: number) {
    try {
      const studentExists = await this.prisma.student.findFirst({
        where: { id: studentId, deletedAt: null },
      });

      if (!studentExists) {
        return ApiResult.failure('El estudiante no existe.', 404);
      }

      const myEnrollments = await this.prisma.enrollment.findMany({
        where: { studentId },
        select: { subjectId: true },
      });

      if (myEnrollments.length === 0) {
        return ApiResult.success<ClassmatesBySubjectDto[]>(
          [],
          'El estudiante no tiene materias inscritas.',
          200,
        );
      }

      const subjectIds = myEnrollments.map((e) => e.subjectId);

      const rawEnrollments = await this.prisma.enrollment.findMany({
        where: {
          subjectId: { in: subjectIds },
          studentId: { not: studentId },
        },
        include: {
          student: true,
          subject: true,
        },
      });

      const grouped = new Map<number, ClassmatesBySubjectDto>();

      for (const e of rawEnrollments) {
        if (!grouped.has(e.subjectId)) {
          grouped.set(e.subjectId, {
            subjectId: e.subjectId,
            subjectName: e.subject.name,
            classmateNames: [],
          });
        }
        const fullName = `${e.student.name} ${e.student.surname}`;
        const group = grouped.get(e.subjectId)!;
        if (!group.classmateNames.includes(fullName)) {
          group.classmateNames.push(fullName);
        }
      }

      const classmates = Array.from(grouped.values())
        .map((g) => ({
          ...g,
          classmateNames: g.classmateNames.sort(),
        }))
        .sort((a, b) => a.subjectName.localeCompare(b.subjectName));

      return ApiResult.success(
        classmates,
        classmates.length === 0 ? 'Sin compañeros en las materias inscritas.' : 'Compañeros obtenidos exitosamente.',
        200,
      );
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async getStudentAcademicRecord(studentId: number) {
    try {
      const student = await this.prisma.student.findFirst({
        where: { id: studentId, deletedAt: null },
      });

      if (!student) {
        return ApiResult.failure('El estudiante no existe.', 404);
      }

      const enrollments = await this.prisma.enrollment.findMany({
        where: { studentId },
        include: {
          subject: { include: { teacher: true } },
        },
        orderBy: { subject: { name: 'asc' } },
      });

      const subjects = enrollments.map((e) => ({
        subjectId: e.subject.id,
        subjectName: e.subject.name,
        teacherName: `${e.subject.teacher.name} ${e.subject.teacher.surname}`,
        credits: e.subject.credits,
      }));

      const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);

      const record: StudentAcademicRecordDto = {
        studentId: student.id,
        studentName: `${student.name} ${student.surname}`,
        subjects,
        totalCredits,
      };

      return ApiResult.success(record, 'Registro académico obtenido exitosamente.', 200);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  async softDelete(id: number) {
    try {
      const enrollment = await this.prisma.enrollment.findFirst({
        where: { id },
      });

      if (!enrollment) {
        return ApiResult.failure('Inscripción no encontrada.', 404);
      }

      await this.prisma.enrollment.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return ApiResult.successEmpty('Inscripción eliminada exitosamente.', 200);
    } catch (error) {
      return ApiResult.failure(`Error en Base de Datos: ${error.message}`, 500);
    }
  }

  private async getStudentTotalCredits(studentId: number): Promise<number> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { studentId },
      include: { subject: true },
    });

    return enrollments.reduce((sum, e) => sum + e.subject.credits, 0);
  }

  private toResponse(e: any): EnrollmentResponseDto {
    return {
      id: e.id,
      studentId: e.studentId,
      studentName: `${e.student.name} ${e.student.surname}`,
      subjectId: e.subjectId,
      subjectName: e.subject.name,
      createdAt: e.createdAt,
    };
  }
}
