import { IsNotEmpty, IsOptional, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty({ example: 'Matemáticas', maxLength: 100 })
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Curso de matemáticas básicas' })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  teacherId: number;

  @ApiProperty({ example: 3 })
  @Min(1)
  credits: number = 3;
}
