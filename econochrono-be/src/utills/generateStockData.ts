import * as fs from 'fs';
import * as path from 'path';

export interface StockPriceEntry {
  timestamp: Date;
  price: number;
}

export interface StockData {
  stockName: string;
  history: StockPriceEntry[];
}

const getRandomPriceChange = (maxPriceChange: number): number => {
  return (Math.random() - 0.5) * 2 * maxPriceChange;
};

export function* generateRandomStockDataInChunks(
  startDate: Date,
  endDate: Date,
  chunkSize: number,
  startPrice: number = 100,
  maxPriceChange: number = 5,
): Generator<StockPriceEntry[]> {
  let history: StockPriceEntry[] = [];
  const totalSeconds = (endDate.getTime() - startDate.getTime()) / 1000;
  let currentTime = new Date(startDate.getTime());

  for (let i = 0; i <= totalSeconds; i++) {
    const previousPrice =
      history.length > 0 ? history[history.length - 1].price : startPrice;
    const priceChange = getRandomPriceChange(maxPriceChange);
    const currentPrice = previousPrice + priceChange;

    history.push({
      timestamp: currentTime,
      price: Math.max(currentPrice, 20),
    });

    if (history.length >= chunkSize || i === totalSeconds) {
      yield history;
      history = [];
    }

    currentTime = new Date(currentTime.getTime() + 1000);
  }
}

export const writeStockDataToFile = (
  stockData: StockData,
  fileName: string,
): void => {
  const writeStream = fs.createWriteStream(path.join(__dirname, fileName), {
    flags: 'a',
  });
  writeStream.write(JSON.stringify(stockData.stockName) + '\n');

  for (const entry of stockData.history) {
    writeStream.write(JSON.stringify(entry) + '\n');
  }

  writeStream.end();
};
