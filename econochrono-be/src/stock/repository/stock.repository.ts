import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PriceHistory,
  MinuteAggregate,
  HourAggregate,
  Stock,
} from '@prisma/client';
import { AppDatabaseService } from 'src/app.service';
import { StockDateRange } from '../types/stock-types';

@Injectable()
export class StockRepository {
  private static readonly ONE_MILLISECOND = 1;
  constructor(private readonly databaseService: AppDatabaseService) {}

  async stockExists(stockId: number): Promise<boolean> {
    const count = await this.databaseService.stock.count({
      where: { stockId: Number(stockId) },
    });
    return count > 0;
  }

  async getStock(stockId: string): Promise<Stock> {
    const stock = await this.databaseService.stock.findUnique({
      where: {
        stockId: Number(stockId),
      },
    });

    if (!stock) {
      throw new NotFoundException(`Stock with ID ${stockId} not found.`);
    }

    return stock;
  }

  async getAllStocks(): Promise<Stock[]> {
    return await this.databaseService.stock.findMany();
  }

  async getStockDateRange(stockId: string): Promise<StockDateRange> {
    return await this.getDateRangeForStock(Number(stockId));
  }

  async getDateRangesForStocks(stockIds: number[]): Promise<StockDateRange[]> {
    return await Promise.all(
      stockIds.map((stockId) => this.getDateRangeForStock(stockId)),
    );
  }

  private async getDateRangeForStock(stockId: number): Promise<StockDateRange> {
    const startDate = await this.databaseService.hourAggregate.findFirst({
      where: { stockId },
      orderBy: { timestamp: 'asc' },
      select: { timestamp: true },
    });

    const endDate = await this.databaseService.hourAggregate.findFirst({
      where: { stockId },
      orderBy: { timestamp: 'desc' },
      select: { timestamp: true },
    });

    if (!startDate || !endDate) {
      throw new NotFoundException(
        `Date range data for Stock with ID ${stockId} not found.`,
      );
    }

    return {
      stockId: stockId,
      startDate: startDate.timestamp,
      endDate: endDate.timestamp,
    };
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
