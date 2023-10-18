import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StockRepository } from './repository/stock.repository';

@Module({
  imports: [PrismaModule],
  providers: [StockService, StockRepository],
  controllers: [StockController],
})
export class StockModule {}
