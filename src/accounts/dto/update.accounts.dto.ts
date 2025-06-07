import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountsDto } from './create.accounts.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAccountsDto extends PartialType(CreateAccountsDto) {
  @IsBoolean()
  @IsOptional()
  active: boolean;
}
