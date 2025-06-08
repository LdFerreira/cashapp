import { IsOptional, IsString } from 'class-validator';

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
}
