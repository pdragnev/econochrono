import { IsDate, IsNumber, IsString } from 'class-validator';

export class StockDataDto {
  @IsNumber()
  stockId: number;

  @IsString()
  stockName: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;
}
