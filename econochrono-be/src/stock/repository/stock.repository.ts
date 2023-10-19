import { Injectable } from '@nestjs/common';
import { PriceHistory } from '@prisma/client';
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

  async getPriceHistory(
    stockId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<PriceHistory[]> {
    try {
      return await this.prisma.priceHistory.findMany({
        where: {
          stockId: Number(stockId),
          timestamp: { gte: startDate, lte: endDate },
        },
      });
    } catch (error) {
      throw new Error(`Failed to fetch price history: ${error.message}`);
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
}
