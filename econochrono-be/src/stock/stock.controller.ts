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
    return await this.stockService.getOptimalTradeTime(
      optimalTradeStockData.stockId,
      optimalTradeStockData.startDate,
      optimalTradeStockData.endDate,
    );
  }
}
