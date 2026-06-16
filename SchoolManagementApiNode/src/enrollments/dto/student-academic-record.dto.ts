import { ApiProperty } from '@nestjs/swagger';

class EnrolledSubjectForRecordDto {
  @ApiProperty()
  subjectId: number;

  @ApiProperty()
  subjectName: string;

  @ApiProperty()
  teacherName: string;

  @ApiProperty()
  credits: number;
}

export class StudentAcademicRecordDto {
  @ApiProperty()
  studentId: number;

  @ApiProperty()
  studentName: string;

  @ApiProperty({ type: [EnrolledSubjectForRecordDto] })
  subjects: EnrolledSubjectForRecordDto[];

  @ApiProperty()
  totalCredits: number;
}
