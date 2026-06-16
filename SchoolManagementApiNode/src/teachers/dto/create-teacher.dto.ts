import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({ example: 'Laura', maxLength: 100 })
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Hernandez', maxLength: 100 })
  @IsNotEmpty()
  @MaxLength(100)
  surname: string;

  @ApiProperty({ example: 'doc.laura.hernandez@example.com', maxLength: 100 })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;
}
