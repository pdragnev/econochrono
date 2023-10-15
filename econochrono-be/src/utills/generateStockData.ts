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

export const generateRandomStockData = (
  stockName: string,
  startDate: Date,
  endDate: Date,
  startPrice: number = 100,
  maxPriceChange: number = 5,
): StockData => {
  const history: StockPriceEntry[] = [];
  const totalSeconds = (endDate.getTime() - startDate.getTime()) / 1000;

  let currentTime = new Date(startDate.getTime());

  for (let i = 0; i <= totalSeconds; i++) {
    const previousPrice =
      history.length > 0 ? history[history.length - 1].price : startPrice;

    const priceChange = getRandomPriceChange(maxPriceChange);
    const currentPrice = previousPrice + priceChange;

    history.push({
      timestamp: currentTime,
      price: Math.max(currentPrice, 20), //minimum stock price of 20
    });

    currentTime = new Date(currentTime.getTime() + 1000);
  }

  return {
    stockName: stockName,
    history: history,
  };
};

export const writeStockDataToFile = (
  stockData: StockData,
  fileName: string,
): void => {
  fs.writeFileSync(
    path.join(__dirname, fileName),
    JSON.stringify(stockData, null, 2),
  );
};
