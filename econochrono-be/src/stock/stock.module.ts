import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StockRepository } from './repository/stock.repository';
import { SecondGranularityStrategy } from './strategies/second-granularity-strategy';
import { MinuteGranularityStrategy } from './strategies/minute-granularity-strategy';
import { HourGranularityStrategy } from './strategies/hour-granularity-strategy';

@Module({
  imports: [PrismaModule],
  providers: [
    StockService,
    StockRepository,
    SecondGranularityStrategy,
    MinuteGranularityStrategy,
    HourGranularityStrategy,
  ],
  controllers: [StockController],
})
export class StockModule {}
