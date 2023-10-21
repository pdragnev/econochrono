import { Module } from '@nestjs/common';
import { StockModule } from './stock/stock.module';
import { AppDatabaseService } from './app.service';

@Module({
  imports: [StockModule],
  controllers: [],
  providers: [AppDatabaseService],
})
export class AppModule {}
