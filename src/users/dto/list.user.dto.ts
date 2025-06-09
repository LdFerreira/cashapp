export class RoleDto {
  name: string;
}
export class UserDTO {
  readonly name: string;
  readonly birthdate: string;
  role: RoleDto;
}
