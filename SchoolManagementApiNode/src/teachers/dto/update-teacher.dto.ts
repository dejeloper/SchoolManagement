import { IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTeacherDto {
  @ApiPropertyOptional({ example: 'Laura', maxLength: 100 })
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'Hernandez', maxLength: 100 })
  @IsOptional()
  @MaxLength(100)
  surname?: string;
}
