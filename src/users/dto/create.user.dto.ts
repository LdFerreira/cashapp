import { IsOptional, IsString, MinLength } from 'class-validator';
import { Roles } from '../../roles/entities/roles.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly name: string;

  @ApiProperty({
    description: 'The birthdate of the user',
    example: '1990-01-01',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly birthdate: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    required: false,
    minLength: 6,
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  readonly password: string;

  @ApiProperty({
    description: 'The role of the user',
    required: false,
    type: () => Roles,
  })
  @IsOptional()
  readonly role?: Roles;
}
