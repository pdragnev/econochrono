import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OptimalTradeStockResultDto } from '../dtos/optimal-trade-stock-result';
import { Granularity, StockDateRange } from '../types/stock-types';
import { StockRepository } from '../repository/stock.repository';
import { StockComputationService } from './stock-computation.service';
import { StockDataDto } from '../dtos/stock-data-dto';
import { Stock } from '@prisma/client';

@Injectable()
export class StockService {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly stockComputationService: StockComputationService,
  ) {}

  async getOptimalTradeTime(
    stockId: number,
    startDate: Date,
    endDate: Date,
    granularity: Granularity,
  ): Promise<OptimalTradeStockResultDto> {
    if (!(await this.stockRepository.stockExists(stockId))) {
      throw new NotFoundException(`Stock with ID ${stockId} not found.`);
    }

    if (!granularity) {
      granularity = this.stockComputationService.determineGranularity(
        startDate,
        endDate,
      );
    }

    try {
      const tradeResult =
        await this.stockComputationService.computeOptimalTrade(
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
  async getStock(stockId: string): Promise<Stock> {
    return await this.stockRepository.getStock(stockId);
  }

  async getStockDateRange(stockId: string): Promise<StockDateRange> {
    return await this.stockRepository.getStockDateRange(stockId);
  }

  async getAllStocks(): Promise<StockDataDto[]> {
    const stocks = await this.stockRepository.getAllStocks();

    const dateRanges = await this.stockRepository.getDateRangesForStocks(
      stocks.map((stock) => stock.stockId),
    );

    return stocks.map((stock) => {
      const dateRange = dateRanges.find(
        (range) => range.stockId === stock.stockId,
      );
      return {
        ...stock,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      };
    });
  }
}
