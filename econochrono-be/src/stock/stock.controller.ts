import {
  Controller,
  Get,
  Query,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { OptimalTradeStockData } from './dtos/optimal-trade-stock-data.dto';
import { OptimalTradeStockResult } from './dtos/optimal-trade-stock-result';
import { CustomExceptionFilter } from 'src/filters/http-exception.filter';

@Controller('stock')
@UseFilters(CustomExceptionFilter)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/optimal-trade')
  @UsePipes(new ValidationPipe())
  async getOptimalTradeTime(
    @Query() optimalTradeStockData: OptimalTradeStockData,
  ): Promise<OptimalTradeStockResult> {
    const { stockId, startDate, endDate } = optimalTradeStockData;

    let granularity = optimalTradeStockData.granularity;

    if (!granularity) {
      const ONE_HOUR = 60 * 60 * 1000;
      const ONE_DAY = 24 * ONE_HOUR;
      const dateDiff =
        new Date(endDate).getTime() - new Date(startDate).getTime();

      if (dateDiff <= ONE_HOUR) {
        granularity = 'second';
      } else if (dateDiff <= ONE_DAY) {
        granularity = 'minute';
      } else {
        granularity = 'hour';
      }
    }

    return await this.stockService.getOptimalTradeTime(
      stockId,
      startDate,
      endDate,
      granularity,
    );
  }
}
