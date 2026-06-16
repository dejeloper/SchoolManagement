import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ example: 'Jhonatan', maxLength: 100 })
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Guerrero', maxLength: 100 })
  @IsNotEmpty()
  @MaxLength(100)
  surname: string;

  @ApiProperty({ example: 'jhonatan.guerrero@example.com', maxLength: 100 })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;
}
