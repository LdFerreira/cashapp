import { IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  readonly name: string;
  @IsString()
  readonly birthdate: string;
  @IsString({ each: true })
  readonly role: string[];
}
