import { Injectable } from '@nestjs/common';
import { PriceHistory, MinuteAggregate, HourAggregate } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockRepository {
  private static readonly ONE_MILLISECOND = 1;
  constructor(private readonly prisma: PrismaService) {}

  async stockExists(stockId: number): Promise<boolean> {
    try {
      const count = await this.prisma.stock.count({
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
    let currentStartDate = startDate;
    while (true) {
      try {
        const priceHistoryChunk = await this.prisma.priceHistory.findMany({
          where: {
            stockId: Number(stockId),
            timestamp: { gte: currentStartDate, lte: endDate },
          },
          take: chunkSize,
          orderBy: { timestamp: 'asc' },
        });

        if (priceHistoryChunk.length === 0) break;

        currentStartDate = new Date(
          priceHistoryChunk[priceHistoryChunk.length - 1].timestamp.getTime() +
            StockRepository.ONE_MILLISECOND,
        );

        yield priceHistoryChunk;
      } catch (error) {
        throw new Error(`Error streaming price history: ${error.message}`);
      }
    }
  }

  async *streamMinuteAggregates(
    stockId: number,
    chunkSize: number,
    startDate: Date,
    endDate: Date,
  ): AsyncGenerator<MinuteAggregate[]> {
    let currentStartDate = startDate;
    while (true) {
      try {
        const aggregateChunk = await this.prisma.minuteAggregate.findMany({
          where: {
            stockId: Number(stockId),
            timestamp: { gte: currentStartDate, lte: endDate },
          },
          take: chunkSize,
          orderBy: { timestamp: 'asc' },
        });

        if (aggregateChunk.length === 0) break;

        currentStartDate = new Date(
          aggregateChunk[aggregateChunk.length - 1].timestamp.getTime() +
            StockRepository.ONE_MILLISECOND,
        );

        yield aggregateChunk;
      } catch (error) {
        throw new Error(`Error streaming minute aggregates: ${error.message}`);
      }
    }
  }

  async *streamHourAggregates(
    stockId: number,
    chunkSize: number,
    startDate: Date,
    endDate: Date,
  ): AsyncGenerator<HourAggregate[]> {
    let currentStartDate = startDate;
    while (true) {
      try {
        const aggregateChunk = await this.prisma.hourAggregate.findMany({
          where: {
            stockId: Number(stockId),
            timestamp: { gte: currentStartDate, lte: endDate },
          },
          take: chunkSize,
          orderBy: { timestamp: 'asc' },
        });

        if (aggregateChunk.length === 0) break;

        currentStartDate = new Date(
          aggregateChunk[aggregateChunk.length - 1].timestamp.getTime() +
            StockRepository.ONE_MILLISECOND,
        );

        yield aggregateChunk;
      } catch (error) {
        throw new Error(`Error streaming hour aggregates: ${error.message}`);
      }
    }
  }
}
