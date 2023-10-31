import { PrismaClient } from '@prisma/client';
import { generateRandomStockDataInChunks } from './generateStockData';
import {
  generateHourAggregates,
  generateMinuteAggregates,
} from './stockAggregations';
import { insertStock, insertStockPrices } from './loadStockDataToDB';

const CHUNK_SIZE = 10000;
const prisma = new PrismaClient();

async function main() {
  const startDate = new Date(Date.UTC(2023, 9, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(2023, 9, 5, 0, 0, 0));

  const stockNames = ['Tesla', 'Apple', 'Amazon'];

  for (const stockName of stockNames) {
    const insertedStock = await insertStock(prisma, { stockName, history: [] });
    console.log(`Stock inserted with name ${insertedStock.stockName}`);

    const stockGenerator = generateRandomStockDataInChunks(
      startDate,
      endDate,
      CHUNK_SIZE,
    );

    for (const stockChunk of stockGenerator) {
      const stockData = { stockName, history: stockChunk };
      await insertStockPrices(
        prisma,
        CHUNK_SIZE,
        insertedStock.stockId,
        stockData.history,
      );
    }

    await generateMinuteAggregates(prisma, insertedStock.stockId);
    console.log(`Minute aggregation complete for ${stockName}`);

    await generateHourAggregates(prisma, insertedStock.stockId);
    console.log(`Hour aggregation complete for ${stockName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
