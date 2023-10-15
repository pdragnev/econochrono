// Import necessary functions and types
import { PrismaClient } from '@prisma/client';
import {
  StockData,
  generateRandomStockData,
  writeStockDataToFile,
} from './generateStockData';
import {
  generateDayAggregates,
  generateHourAggregates,
  generateMinuteAggregates,
} from './stockAggregations';
import { insertStockIntoDatabase } from './loadStockDataToDB';

const prisma = new PrismaClient();

async function main() {
  const startDate = new Date(Date.UTC(2023, 9, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(2023, 9, 11, 0, 0, 0));
  const stockName = 'EconoTech';
  const stockData: StockData = generateRandomStockData(
    stockName,
    startDate,
    endDate,
  );

  writeStockDataToFile(stockData, 'stockData.json');

  const insertedStock = await insertStockIntoDatabase(prisma, stockData);
  console.log(`Stock inserted with name ${insertedStock.stockName}`);

  await generateMinuteAggregates(prisma, insertedStock.stockId);
  console.log('Minute aggregation complete');

  await generateHourAggregates(prisma, insertedStock.stockId);
  console.log('Hour aggregation complete');

  await generateDayAggregates(prisma, insertedStock.stockId);
  console.log('Day aggregation complete');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
