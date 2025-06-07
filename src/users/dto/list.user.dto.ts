import { Expose, Type } from 'class-transformer';

export class RoleDto {
  @Expose()
  name: string;
}
export class UserDTO {
  @Expose()
  readonly name: string;
  @Expose()
  readonly birthdate: string;
  @Expose()
  @Type(() => RoleDto)
  role: RoleDto;
}
