import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OptimalTradeStockResult } from './dtos/optimal-trade-stock-result';
import { TradeResult, UnifiedDataPoint } from './types/stock-types';
import { Decimal } from '@prisma/client/runtime/library';
import { StockRepository } from './repository/stock.repository';
import { SecondGranularityStrategy } from './strategies/second-granularity-strategy';
import { MinuteGranularityStrategy } from './strategies/minute-granularity-strategy';
import { HourGranularityStrategy } from './strategies/hour-granularity-strategy';
import { GranularityStrategy } from './strategies/granularity-strategy';

@Injectable()
export class StockService {
  private readonly CHUNK_SIZE = 10000;
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly secondGranularityStrategy: SecondGranularityStrategy,
    private readonly minuteGranularityStrategy: MinuteGranularityStrategy,
    private readonly hourGranularityStrategy: HourGranularityStrategy,
  ) {}

  async getOptimalTradeTime(
    stockId: number,
    startDate: Date,
    endDate: Date,
    granularity: 'second' | 'minute' | 'hour',
  ): Promise<OptimalTradeStockResult> {
    if (!(await this.stockRepository.stockExists(stockId))) {
      throw new NotFoundException(`Stock with ID ${stockId} not found.`);
    }
    try {
      const tradeResult = await this.computeOptimalTrade(
        stockId,
        startDate,
        endDate,
        granularity,
      );

      return {
        buyTime: tradeResult.buyTime,
        sellTime: tradeResult.sellTime,
        maxProfit: tradeResult.maxProfit.toNumber(),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to compute optimal trade time: ${error.message}`,
      );
    }
  }

  async computeOptimalTrade(
    stockId: number,
    startDate: Date,
    endDate: Date,
    granularity: 'second' | 'minute' | 'hour',
  ): Promise<TradeResult> {
    let overallResult: TradeResult = {
      maxProfit: new Decimal(0),
      buyTime: new Date(0),
      sellTime: new Date(0),
      minPriceInChunk: new Decimal(Infinity),
      minPriceTimestamp: new Date(0),
    };

    let strategy: GranularityStrategy;

    switch (granularity) {
      case 'second':
        strategy = this.secondGranularityStrategy;
        break;
      case 'minute':
        strategy = this.minuteGranularityStrategy;
        break;
      case 'hour':
        strategy = this.hourGranularityStrategy;
        break;
      default:
        throw new Error('Invalid granularity specified.');
    }

    const dataStreamIterator = strategy.streamData(
      stockId,
      this.CHUNK_SIZE,
      startDate,
      endDate,
    );

    for await (const chunk of dataStreamIterator) {
      const chunkResult = this.computeOptimalTradeForChunk(
        chunk,
        overallResult.minPriceInChunk,
        overallResult.minPriceTimestamp,
      );

      if (chunkResult.maxProfit.greaterThan(overallResult.maxProfit)) {
        overallResult.maxProfit = chunkResult.maxProfit;
        overallResult.buyTime = chunkResult.buyTime;
        overallResult.sellTime = chunkResult.sellTime;
      }

      overallResult.minPriceInChunk = chunkResult.minPriceInChunk;
      overallResult.minPriceTimestamp = chunkResult.minPriceTimestamp;
    }

    return {
      maxProfit: overallResult.maxProfit,
      buyTime: overallResult.buyTime,
      sellTime: overallResult.sellTime,
    };
  }

  computeOptimalTradeForChunk(
    data: UnifiedDataPoint[],
    minPriceSoFar: Decimal,
    minPriceTimestamp: Date,
  ): TradeResult {
    let chunkResult: TradeResult = {
      maxProfit: new Decimal(0),
      buyTime: new Date(0),
      sellTime: new Date(0),
      minPriceInChunk: minPriceSoFar,
      minPriceTimestamp: minPriceTimestamp,
    };

    for (let i = 0; i < data.length; i++) {
      const currentPrice =
        data[i].price !== undefined ? data[i].price : data[i].minPrice;

      if (currentPrice.lessThan(chunkResult.minPriceInChunk)) {
        chunkResult.minPriceInChunk = currentPrice;
        chunkResult.minPriceTimestamp = data[i].timestamp;
      }

      const potentialMaxPrice =
        data[i].price !== undefined ? data[i].price : data[i].maxPrice;
      const profit = potentialMaxPrice.minus(chunkResult.minPriceInChunk);

      if (profit.greaterThan(chunkResult.maxProfit)) {
        chunkResult.maxProfit = profit;
        chunkResult.buyTime = chunkResult.minPriceTimestamp;
        chunkResult.sellTime = data[i].timestamp;
      }
    }

    return chunkResult;
  }
}
