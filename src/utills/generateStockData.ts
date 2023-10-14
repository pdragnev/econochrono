import * as fs from 'fs';
import * as path from 'path';

interface StockPriceEntry {
  timestamp: Date;
  price: number;
}

interface StockData {
  stockName: string;
  history: StockPriceEntry[];
}

export const generateRandomStockData = (
  stockName: string,
  startDate: Date,
  endDate: Date,
  startPrice: number = 100,
  maxPriceChange: number = 5,
): StockData => {
  const history: StockPriceEntry[] = [];
  const totalSeconds = (endDate.getTime() - startDate.getTime()) / 1000;

  for (let i = 0; i <= totalSeconds; i++) {
    const previousPrice =
      history.length > 0 ? history[history.length - 1].price : startPrice;
    const priceChange = (Math.random() - 0.5) * 2 * maxPriceChange;
    const currentPrice = previousPrice + priceChange;

    const currentTime = new Date(startDate.getTime() + i * 1000);
    history.push({
      timestamp: currentTime,
      price: Math.max(currentPrice, 1),
    });
  }

  return {
    stockName: stockName,
    history: history,
  };
};

const startDate = new Date('2023-10-01 00:00:00');
const endDate = new Date('2023-10-01 23:59:59');
const stockName = 'EconoTech';
const stockData = generateRandomStockData(stockName, startDate, endDate);
fs.writeFileSync(
  path.join(__dirname, 'stockData.json'),
  JSON.stringify(stockData, null, 2),
);
