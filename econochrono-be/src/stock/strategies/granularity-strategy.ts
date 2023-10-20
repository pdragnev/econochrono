import { StockRepository } from '../repository/stock.repository';
import { UnifiedDataPoint } from '../types/stock-types';

export abstract class GranularityStrategy {
  constructor(protected readonly stockRepository: StockRepository) {}

  abstract streamData(
    stockId: number,
    chunkSize: number,
    startDate: Date,
    endDate: Date,
  ): AsyncIterableIterator<UnifiedDataPoint[]>;
}
