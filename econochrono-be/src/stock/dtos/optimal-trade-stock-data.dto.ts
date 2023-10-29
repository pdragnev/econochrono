import {
  IsInt,
  IsNotEmpty,
  IsIn,
  IsDateString,
  IsNumber,
  IsPositive,
} from 'class-validator';
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

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsIn([Granularity.SECOND, Granularity.MINUTE, Granularity.HOUR, undefined])
  granularity?: Granularity;
}
