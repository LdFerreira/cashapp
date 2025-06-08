import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TransactionType } from './transactions.enum';

export class StatementFilterDto {
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
