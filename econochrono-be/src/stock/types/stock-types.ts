import { Decimal } from '@prisma/client/runtime/library';

export interface StockPriceDecimalEntry {
  timestamp: Date;
  price: Decimal;
}

export type TradeResult = {
  maxProfit: Decimal;
  buyTime: Date;
  sellTime: Date;
  minPriceInChunk?: Decimal;
  minPriceTimestamp?: Date;
};

export class UnifiedDataPoint {
  timestamp: Date;
  minPrice?: Decimal;
  maxPrice?: Decimal;
  price?: Decimal;
}
