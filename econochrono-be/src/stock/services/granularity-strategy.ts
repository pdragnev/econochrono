import { Injectable } from '@nestjs/common';
import { StockRepository } from '../repository/stock.repository';
import { Granularity, UnifiedDataPoint } from '../types/stock-types';

@Injectable()
export class GranularityStrategy {
  private readonly granularityStreamMethods: Record<
    Granularity,
    (
      stockId: number,
      chunkSize: number,
      startDate: Date,
      endDate: Date,
    ) => AsyncIterableIterator<UnifiedDataPoint[]>
  >;

  constructor(protected readonly stockRepository: StockRepository) {
    this.granularityStreamMethods = {
      [Granularity.SECOND]: this.stockRepository.streamPriceHistory.bind(
        this.stockRepository,
      ),
      [Granularity.MINUTE]: this.stockRepository.streamMinuteAggregates.bind(
        this.stockRepository,
      ),
      [Granularity.HOUR]: this.stockRepository.streamHourAggregates.bind(
        this.stockRepository,
      ),
    };
  }

  async *streamData(
    stockId: number,
    chunkSize: number,
    startDate: Date,
    endDate: Date,
    granularity: Granularity,
  ): AsyncIterableIterator<UnifiedDataPoint[]> {
    const streamMethod = this.granularityStreamMethods[granularity];

    if (!streamMethod) {
      throw new Error('Invalid granularity specified.');
    }

    for await (const chunk of streamMethod(
      stockId,
      chunkSize,
      startDate,
      endDate,
    )) {
      if (granularity === Granularity.SECOND) {
        yield chunk.map((data) => ({
          timestamp: data.timestamp,
          price: data.price,
        }));
      } else {
        yield chunk.map((data) => ({
          timestamp: data.timestamp,
          minPrice: data.minPrice,
          maxPrice: data.maxPrice,
        }));
      }
    }
  }
}
