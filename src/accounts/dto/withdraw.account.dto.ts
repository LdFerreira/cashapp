import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class WithdrawDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0.01, { message: 'O valor do saque deve ser maior que zero.' })
  value: number;
}
