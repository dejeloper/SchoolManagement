import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Students
  const students = await Promise.all([
    prisma.student.create({ data: { name: 'Jhonatan', surname: 'Guerrero', email: 'jhonatan.guerrero@example.com' } }),
    prisma.student.create({ data: { name: 'Maria', surname: 'Lopez', email: 'maria.lopez@example.com' } }),
    prisma.student.create({ data: { name: 'Carlos', surname: 'Perez', email: 'carlos.perez@example.com' } }),
    prisma.student.create({ data: { name: 'Ana', surname: 'Gomez', email: 'ana.gomez@example.com' } }),
    prisma.student.create({ data: { name: 'Luis', surname: 'Martinez', email: 'luis.martinez@example.com' } }),
    prisma.student.create({ data: { name: 'Sofia', surname: 'Rodriguez', email: 'sofia.rodriguez@example.com' } }),
    prisma.student.create({ data: { name: 'Diego', surname: 'Sanchez', email: 'diego.sanchez@example.com' } }),
    prisma.student.create({ data: { name: 'Valentina', surname: 'Fernandez', email: 'valentina.fernandez@example.com' } }),
    prisma.student.create({ data: { name: 'Mateo', surname: 'Gonzalez', email: 'mateo.gonzalez@example.com' } }),
    prisma.student.create({ data: { name: 'Isabella', surname: 'Ramirez', email: 'isabella.ramirez@example.com' } }),
  ]);

  // Teachers
  const teachers = await Promise.all([
    prisma.teacher.create({ data: { name: 'Laura', surname: 'Hernandez', email: 'doc.laura.hernandez@example.com' } }),
    prisma.teacher.create({ data: { name: 'Andres', surname: 'Vargas', email: 'doc.andres.vargas@example.com' } }),
    prisma.teacher.create({ data: { name: 'Sofia', surname: 'Mendoza', email: 'doc.sofia.mendoza@example.com' } }),
    prisma.teacher.create({ data: { name: 'Diego', surname: 'Castro', email: 'doc.diego.castro@example.com' } }),
    prisma.teacher.create({ data: { name: 'Valentina', surname: 'Rios', email: 'doc.valentina.rios@example.com' } }),
  ]);

  // Subjects
  const subjects = await Promise.all([
    prisma.subject.create({ data: { name: 'Matemáticas', description: 'Curso de matemáticas básicas', teacherId: teachers[0].id } }),
    prisma.subject.create({ data: { name: 'Física', description: 'Curso de física clásica', teacherId: teachers[0].id } }),
    prisma.subject.create({ data: { name: 'Historia', description: 'Curso de historia mundial', teacherId: teachers[1].id } }),
    prisma.subject.create({ data: { name: 'Geografía', description: 'Curso de geografía mundial', teacherId: teachers[1].id } }),
    prisma.subject.create({ data: { name: 'Literatura', description: 'Curso de literatura clásica', teacherId: teachers[2].id } }),
    prisma.subject.create({ data: { name: 'Inglés', description: 'Curso de inglés avanzado', teacherId: teachers[2].id } }),
    prisma.subject.create({ data: { name: 'Biología', description: 'Curso de biología general', teacherId: teachers[3].id } }),
    prisma.subject.create({ data: { name: 'Química', description: 'Curso de química orgánica', teacherId: teachers[3].id } }),
    prisma.subject.create({ data: { name: 'Arte', description: 'Curso de arte contemporáneo', teacherId: teachers[4].id } }),
    prisma.subject.create({ data: { name: 'Música', description: 'Curso de música clásica', teacherId: teachers[4].id } }),
  ]);

  // Users
  await Promise.all([
    prisma.user.create({ data: { usuario: 'admin', rol: 'admin' } }),
    prisma.user.create({ data: { usuario: 'auxiliar1', rol: 'auxiliar' } }),
    prisma.user.create({ data: { usuario: 'auxiliar2', rol: 'auxiliar' } }),
  ]);

  console.log('Seed data inserted successfully!');
  console.log(`  ${students.length} students`);
  console.log(`  ${teachers.length} teachers`);
  console.log(`  ${subjects.length} subjects`);
  console.log(`  3 users`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
