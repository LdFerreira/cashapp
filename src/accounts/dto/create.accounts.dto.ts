import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Users } from '../../users/entities/users.entity';

export class CreateAccountsDto {
  @IsString()
  readonly userId: Users;
  
  @IsBoolean()
  @IsOptional()
  readonly active?: boolean;
}
