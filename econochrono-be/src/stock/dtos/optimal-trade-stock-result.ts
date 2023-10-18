import { IsDate, IsNumber } from 'class-validator';

export class OptimalTradeStockResult {
  @IsDate()
  buyTime: Date;

  @IsDate()
  sellTime: Date;

  @IsNumber()
  maxProfit: number;
}
