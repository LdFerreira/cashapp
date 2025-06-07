import { IsString } from 'class-validator';
import { Roles } from '../../roles/entities/roles.entity';

export class CreateUserDTO {
  @IsString()
  readonly name: string;
  @IsString()
  readonly birthdate: string;
  @IsString({ each: true })
  readonly role: Roles;
}
