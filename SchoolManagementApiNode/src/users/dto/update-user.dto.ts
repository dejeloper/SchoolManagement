import { IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'admin', maxLength: 100 })
  @IsOptional()
  @MaxLength(100)
  usuario?: string;

  @ApiPropertyOptional({ example: 'admin', maxLength: 50 })
  @IsOptional()
  @MaxLength(50)
  rol?: string;
}
