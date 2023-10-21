import { IsDate, IsNumber } from 'class-validator';

export class OptimalTradeStockResultDto {
  @IsDate()
  buyTime: Date;

  @IsDate()
  sellTime: Date;

  @IsNumber()
  maxProfit: number;
}
