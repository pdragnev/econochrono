import { IsInt, IsDateString, IsNotEmpty, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class OptimalTradeStockData {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  stockId: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsIn(['second', 'minute', 'hour'])
  granularity?: 'second' | 'minute' | 'hour';
}
