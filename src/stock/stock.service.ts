import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  async getStockData(stockName: string, startDate: Date, endDate: Date) {
    const stockData = await this.prisma.stock.findUnique({
      where: {
        stockName: stockName,
      },
      select: {
        prices: {
          where: {
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            timestamp: true,
            price: true,
          },
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
    });

    return stockData?.prices || [];
  }
}
