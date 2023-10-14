import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'stockData.json'), 'utf-8'),
  );

  const stock = await prisma.stock.create({
    data: {
      stockName: data.stockName,
      prices: {
        create: data.history.map((entry) => ({
          timestamp: new Date(entry.timestamp),
          price: entry.price,
        })),
      },
    },
  });

  console.log(`Inserted stock with ID ${stock.stockId}`);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
