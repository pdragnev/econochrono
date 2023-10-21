import { IsInt, IsNotEmpty, IsIn, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Granularity } from '../types/stock-types';

export class OptimalTradeStockDataDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  stockId: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsIn([Granularity.SECOND, Granularity.MINUTE, Granularity.HOUR, undefined])
  granularity?: Granularity;
}
