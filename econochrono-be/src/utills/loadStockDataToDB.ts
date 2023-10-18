import { PrismaClient, Stock } from '@prisma/client';
import { StockData, StockPriceEntry } from './generateStockData';

export async function insertStock(
  prisma: PrismaClient,
  stockData: StockData,
): Promise<Stock> {
  return await prisma.stock.create({
    data: {
      stockName: stockData.stockName,
    },
  });
}

export async function insertStockPrices(
  prisma: PrismaClient,
  chuckSize: number,
  stockId: number,
  prices: StockPriceEntry[],
): Promise<void> {
  for (let i = 0; i < prices.length; i += chuckSize) {
    const chunk = prices.slice(i, i + chuckSize);
    const priceData = chunk.map((entry) => ({
      timestamp: new Date(entry.timestamp),
      price: entry.price,
      stockId: stockId,
    }));

    await prisma.priceHistory.createMany({
      data: priceData,
    });
  }
}
