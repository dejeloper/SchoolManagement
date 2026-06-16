import { IsOptional, Min, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSubjectDto {
  @ApiPropertyOptional({ example: 'Matemáticas', maxLength: 100 })
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'Curso de matemáticas básicas' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  teacherId?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Min(1)
  credits?: number;
}
