import { Module } from '@nestjs/common';
import { StockService } from './services/stock.service';
import { StockController } from './controller/stock.controller';
import { StockRepository } from './repository/stock.repository';
import { AppDatabaseService } from 'src/app.service';
import { GranularityStrategy } from './services/granularity-strategy';

@Module({
  imports: [],
  providers: [
    StockService,
    StockRepository,
    GranularityStrategy,
    AppDatabaseService,
  ],
  controllers: [StockController],
})
export class StockModule {}
