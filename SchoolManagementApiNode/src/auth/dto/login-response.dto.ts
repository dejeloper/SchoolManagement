import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './login.dto';

export class LoginResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;
}
