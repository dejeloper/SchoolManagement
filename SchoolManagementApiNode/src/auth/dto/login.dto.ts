import { IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  Teacher = 1,
  Student = 2,
  Admin = 99,
  Auxiliar = 98,
}

export class LoginDto {
  @ApiProperty({ example: 'jhonatan.guerrero@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.Student })
  @IsEnum(UserRole)
  role: UserRole;
}
