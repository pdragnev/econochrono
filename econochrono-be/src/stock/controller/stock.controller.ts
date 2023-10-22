import {
  Controller,
  Get,
  Param,
  Query,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StockService } from '../services/stock.service';
import { OptimalTradeStockDataDto } from '../dtos/optimal-trade-stock-data.dto';
import { OptimalTradeStockResultDto } from '../dtos/optimal-trade-stock-result';
import { CustomExceptionFilter } from 'src/filters/http-exception.filter';
import { GetStockDto } from '../dtos/get-stock-dto';
import { StockDataDto } from '../dtos/stock-data-dto';

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

  @Get('/:stockId')
  async getStock(@Param() getStockDto: GetStockDto): Promise<StockDataDto> {
    const stock = await this.stockService.getStock(getStockDto.stockId);
    const stockDateRange = await this.stockService.getStockDateRange(
      getStockDto.stockId,
    );
    return {
      ...stock,
      startDate: stockDateRange.startDate,
      endDate: stockDateRange.endDate,
    };
  }

  @Get('/')
  async getAllStocks(): Promise<StockDataDto[]> {
    return await this.stockService.getAllStocks();
  }
}
