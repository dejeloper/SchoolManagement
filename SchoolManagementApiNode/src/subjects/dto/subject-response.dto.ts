import { ApiProperty } from '@nestjs/swagger';

export class SubjectResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty()
  credits: number;

  @ApiProperty()
  teacherId: number;

  @ApiProperty()
  teacherName: string;
}
