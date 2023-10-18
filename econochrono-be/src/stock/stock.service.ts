import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OptimalTradeStockResult } from './dtos/optimal-trade-stock-result';
import { StockPriceDecimalEntry, TradeResult } from './types/stock-types';
import { Decimal } from '@prisma/client/runtime/library';
import { StockRepository } from './repository/stock.repository';

@Injectable()
export class StockService {
  private readonly CHUNK_SIZE = 10000;
  constructor(private readonly stockRepository: StockRepository) {}

  async getOptimalTradeTime(
    stockId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<OptimalTradeStockResult> {
    if (!(await this.stockRepository.stockExists(stockId))) {
      throw new NotFoundException(`Stock with ID ${stockId} not found.`);
    }
    try {
      const tradeResult = await this.computeOptimalTrade(
        stockId,
        startDate,
        endDate,
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
  ): Promise<TradeResult> {
    let overallResult: TradeResult = {
      maxProfit: new Decimal(0),
      buyTime: new Date(0),
      sellTime: new Date(0),
      minPriceInChunk: new Decimal(Infinity),
      minPriceTimestamp: new Date(0),
    };

    const priceHistoryIterator = this.stockRepository.streamPriceHistory(
      stockId,
      this.CHUNK_SIZE,
      startDate,
      endDate,
    );

    for await (const chunk of priceHistoryIterator) {
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
    data: StockPriceDecimalEntry[],
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
      if (data[i].price.lessThan(chunkResult.minPriceInChunk)) {
        chunkResult.minPriceInChunk = data[i].price;
        chunkResult.minPriceTimestamp = data[i].timestamp;
      }

      const profit = data[i].price.minus(chunkResult.minPriceInChunk);

      if (profit.greaterThan(chunkResult.maxProfit)) {
        chunkResult.maxProfit = profit;
        chunkResult.buyTime = chunkResult.minPriceTimestamp;
        chunkResult.sellTime = data[i].timestamp;
      }
    }

    return chunkResult;
  }
}
