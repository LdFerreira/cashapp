import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountsDto {
  @ApiProperty({
    description: 'The ID of the user who owns the account',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsString()
  readonly userId: string;

  @ApiProperty({
    description: 'Whether the account is active',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  readonly active?: boolean; // Ideia esquecida
}
