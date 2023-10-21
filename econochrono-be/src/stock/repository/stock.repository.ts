import { Injectable } from '@nestjs/common';
import { PriceHistory, MinuteAggregate, HourAggregate } from '@prisma/client';
import { AppDatabaseService } from 'src/app.service';

@Injectable()
export class StockRepository {
  private static readonly ONE_MILLISECOND = 1;
  constructor(private readonly databaseService: AppDatabaseService) {}

  async stockExists(stockId: number): Promise<boolean> {
    try {
      const count = await this.databaseService.stock.count({
        where: { stockId: Number(stockId) },
      });
      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check stock existence: ${error.message}`);
    }
  }

  async *streamPriceHistory(
    stockId: number,
    chunkSize: number,
    startDate: Date,
    endDate: Date,
  ): AsyncGenerator<PriceHistory[]> {
    let currentStartDate = new Date(startDate);
    endDate = new Date(endDate);

    while (currentStartDate <= endDate) {
      const priceHistoryChunk =
        await this.databaseService.priceHistory.findMany({
          where: {
            stockId: Number(stockId),
            timestamp: { gte: currentStartDate, lte: endDate },
          },
          take: chunkSize,
          orderBy: { timestamp: 'asc' },
        });

      if (priceHistoryChunk.length === 0) return;

      currentStartDate = new Date(
        priceHistoryChunk[priceHistoryChunk.length - 1].timestamp.getTime() +
          StockRepository.ONE_MILLISECOND,
      );

      yield priceHistoryChunk;
    }
  }

  async *streamMinuteAggregates(
    stockId: number,
    chunkSize: number,
    startDate: Date,
    endDate: Date,
  ): AsyncGenerator<MinuteAggregate[]> {
    let currentStartDate = new Date(startDate);
    endDate = new Date(endDate);

    while (currentStartDate <= endDate) {
      const aggregateChunk =
        await this.databaseService.minuteAggregate.findMany({
          where: {
            stockId: Number(stockId),
            timestamp: { gte: currentStartDate, lte: endDate },
          },
          take: chunkSize,
          orderBy: { timestamp: 'asc' },
        });

      if (aggregateChunk.length === 0) return;

      currentStartDate = new Date(
        aggregateChunk[aggregateChunk.length - 1].timestamp.getTime() +
          +StockRepository.ONE_MILLISECOND,
      );

      yield aggregateChunk;
    }
  }

  async *streamHourAggregates(
    stockId: number,
    chunkSize: number,
    startDate: Date,
    endDate: Date,
  ): AsyncGenerator<HourAggregate[]> {
    let currentStartDate = new Date(startDate);
    endDate = new Date(endDate);

    while (currentStartDate <= endDate) {
      const aggregateChunk = await this.databaseService.hourAggregate.findMany({
        where: {
          stockId: Number(stockId),
          timestamp: { gte: currentStartDate, lte: endDate },
        },
        take: chunkSize,
        orderBy: { timestamp: 'asc' },
      });

      if (aggregateChunk.length === 0) return;

      currentStartDate = new Date(
        aggregateChunk[aggregateChunk.length - 1].timestamp.getTime() +
          +StockRepository.ONE_MILLISECOND,
      );

      yield aggregateChunk;
    }
  }
}
