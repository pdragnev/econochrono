import { Prisma, PrismaClient, Stock } from '@prisma/client';
import { StockData, StockPriceEntry } from './generateStockData';

async function insertStock(
  prisma: PrismaClient,
  stockData: StockData,
): Promise<Stock> {
  return await prisma.stock.create({
    data: {
      stockName: stockData.stockName,
    },
  });
}

async function insertStockPrices(
  prisma: PrismaClient,
  stockId: number,
  prices: StockPriceEntry[],
): Promise<void> {
  const priceData = prices.map((entry) => ({
    timestamp: new Date(entry.timestamp),
    price: entry.price,
    stockId: stockId,
  }));

  await prisma.priceHistory.createMany({
    data: priceData,
  });
}

export async function insertStockIntoDatabase(
  prisma: PrismaClient,
  stockData: StockData,
): Promise<Stock> {
  try {
    const stock = await insertStock(prisma, stockData);
    await insertStockPrices(prisma, stock.stockId, stockData.history);
    return stock;
  } catch (error) {
    console.error('Error inserting stock data into database:', error);
    throw error;
  }
}
