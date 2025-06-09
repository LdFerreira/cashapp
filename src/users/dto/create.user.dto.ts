import { IsOptional, IsString, MinLength } from 'class-validator';
import { Roles } from '../../roles/entities/roles.entity';

export class CreateUserDTO {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly birthdate: string;

  @IsString()
  @IsOptional()
  readonly email: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  readonly password: string;

  @IsOptional()
  readonly role?: Roles;
}
