import {
  Controller,
  Get,
  Query,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { OptimalTradeStockDataDto } from './dtos/optimal-trade-stock-data.dto';
import { OptimalTradeStockResultDto } from './dtos/optimal-trade-stock-result';
import { CustomExceptionFilter } from 'src/filters/http-exception.filter';
import { Granularity } from './types/stock-types';

@Controller('stock')
@UseFilters(CustomExceptionFilter)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/optimal-trade')
  @UsePipes(new ValidationPipe())
  async getOptimalTradeTime(
    @Query() optimalTradeStockDataDto: OptimalTradeStockDataDto,
  ): Promise<OptimalTradeStockResultDto> {
    const { stockId, startDate, endDate, granularity } =
      optimalTradeStockDataDto;
    return await this.stockService.getOptimalTradeTime(
      stockId,
      startDate,
      endDate,
      granularity,
    );
  }
}
