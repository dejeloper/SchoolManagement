import { IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStudentDto {
  @ApiPropertyOptional({ example: 'Jhonatan', maxLength: 100 })
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'Guerrero', maxLength: 100 })
  @IsOptional()
  @MaxLength(100)
  surname?: string;
}
