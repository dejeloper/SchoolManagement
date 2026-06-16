import { ApiProperty } from '@nestjs/swagger';

export class EnrollmentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  studentId: number;

  @ApiProperty()
  studentName: string;

  @ApiProperty()
  subjectId: number;

  @ApiProperty()
  subjectName: string;

  @ApiProperty()
  createdAt: Date;
}
