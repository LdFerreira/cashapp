import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DepositDto {
  @ApiProperty({
    description: 'The amount to deposit',
    example: 100.50,
    minimum: 0.01,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01, { message: 'O valor do depósito deve ser maior que zero.' })
  value: number;
}
