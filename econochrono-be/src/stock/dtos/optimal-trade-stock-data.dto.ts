import { IsInt, IsDateString, IsNotEmpty } from 'class-validator';
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
}
