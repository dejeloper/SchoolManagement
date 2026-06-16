import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'admin', maxLength: 100 })
  @IsNotEmpty()
  @MaxLength(100)
  usuario: string;

  @ApiProperty({ example: 'admin', maxLength: 50 })
  @IsNotEmpty()
  @MaxLength(50)
  rol: string;
}
