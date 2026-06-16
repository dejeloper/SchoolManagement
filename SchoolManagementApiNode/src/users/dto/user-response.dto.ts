import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  usuario: string;

  @ApiProperty()
  rol: string;

  @ApiProperty()
  createdAt: Date;
}
