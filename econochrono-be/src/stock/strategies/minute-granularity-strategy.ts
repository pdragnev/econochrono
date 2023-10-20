import { Injectable } from '@nestjs/common';
import { GranularityStrategy } from './granularity-strategy';
import { StockRepository } from '../repository/stock.repository';
import { UnifiedDataPoint } from '../types/stock-types';

@Injectable()
export class MinuteGranularityStrategy extends GranularityStrategy {
  constructor(protected readonly stockRepository: StockRepository) {
    super(stockRepository);
  }

  async *streamData(
    stockId: number,
    chunkSize: number,
    startDate: Date,
    endDate: Date,
  ): AsyncIterableIterator<UnifiedDataPoint[]> {
    for await (const chunk of this.stockRepository.streamMinuteAggregates(
      stockId,
      chunkSize,
      startDate,
      endDate,
    )) {
      yield chunk.map((data) => ({
        timestamp: data.timestamp,
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
      }));
    }
  }
}
