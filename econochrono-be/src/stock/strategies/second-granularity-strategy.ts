import { StockRepository } from '../repository/stock.repository';
import { GranularityStrategy } from './granularity-strategy';
import { UnifiedDataPoint } from '../types/stock-types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SecondGranularityStrategy extends GranularityStrategy {
  constructor(protected readonly stockRepository: StockRepository) {
    super(stockRepository);
  }

  async *streamData(
    stockId: number,
    chunkSize: number,
    startDate: Date,
    endDate: Date,
  ): AsyncIterableIterator<UnifiedDataPoint[]> {
    for await (const chunk of this.stockRepository.streamPriceHistory(
      stockId,
      chunkSize,
      startDate,
      endDate,
    )) {
      yield chunk.map((data) => ({
        timestamp: data.timestamp,
        price: data.price,
      }));
    }
  }
}
