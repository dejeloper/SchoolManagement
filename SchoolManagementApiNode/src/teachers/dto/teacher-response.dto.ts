import { ApiProperty } from '@nestjs/swagger';

export class TeacherResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;
}
