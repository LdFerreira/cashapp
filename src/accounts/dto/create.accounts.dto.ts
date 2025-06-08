import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateAccountsDto {
  @IsString()
  readonly userId: string;

  @IsBoolean()
  @IsOptional()
  readonly active?: boolean;
}
