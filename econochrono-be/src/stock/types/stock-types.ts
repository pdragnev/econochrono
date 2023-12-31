import { Decimal } from '@prisma/client/runtime/library';

export interface StockPriceDecimalEntry {
  timestamp: Date;
  price: Decimal;
}

export interface TradeResult {
  maxProfit: Decimal;
  buyTime: Date;
  sellTime: Date;
  buyPrice: Decimal;
  sellPrice: Decimal;
  minPriceInChunk?: Decimal;
  minPriceTimestamp?: Date;
}

export interface UnifiedDataPoint {
  timestamp: Date;
  minPrice?: Decimal;
  maxPrice?: Decimal;
  price?: Decimal;
}

export enum Granularity {
  SECOND = 'second',
  MINUTE = 'minute',
  HOUR = 'hour',
}

export interface StockDateRange {
  stockId: number;
  startDate: Date;
  endDate: Date;
}
