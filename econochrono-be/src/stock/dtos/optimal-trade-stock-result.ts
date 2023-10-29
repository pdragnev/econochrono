import { IsDate, IsNumber } from 'class-validator';

export class OptimalTradeStockResultDto {
  @IsDate()
  buyTime: Date;

  @IsDate()
  sellTime: Date;

  @IsNumber()
  buyPrice: number;

  @IsNumber()
  sellPrice: number;

  @IsNumber()
  numberOfStocks: number;

  @IsNumber()
  totalProfit: number;
}
