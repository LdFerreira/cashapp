import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TransferDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0.01, { message: 'O valor da transferência deve ser maior que zero.' })
  value: number;
}
