import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDTO {
  @ApiProperty({
    description: 'The name of the role',
    example: 'admin',
    required: true,
  })
  @IsString()
  name: string;
}
