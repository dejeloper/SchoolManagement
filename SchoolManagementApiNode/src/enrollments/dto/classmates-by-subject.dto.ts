import { ApiProperty } from '@nestjs/swagger';

export class ClassmatesBySubjectDto {
  @ApiProperty()
  subjectId: number;

  @ApiProperty()
  subjectName: string;

  @ApiProperty({ type: [String] })
  classmateNames: string[];
}
