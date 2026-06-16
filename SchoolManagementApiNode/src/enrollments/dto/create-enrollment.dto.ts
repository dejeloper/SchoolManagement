import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  studentId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  subjectId: number;
}
