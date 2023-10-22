import { Test, TestingModule } from '@nestjs/testing';
import { StockService } from '../stock.service';
import { StockRepository } from 'src/stock/repository/stock.repository';
import { GranularityStrategy } from '../granularity-strategy';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Granularity, UnifiedDataPoint } from 'src/stock/types/stock-types';
import { mockHourlyAggregateData } from './mockData';
import { AppDatabaseService } from 'src/app.service';

describe('StockService', () => {
  let service: StockService;
  let mockStockRepository = {
    stockExists: jest.fn(),
  };
  let mockGranularityStrategy = {
    streamData: jest.fn(),
  };
  let mockAppDatabaseService = {
    stock: {
      count: jest.fn(),
    },
    priceHistory: {
      findMany: jest.fn(),
    },
    minuteAggregate: {
      findMany: jest.fn(),
    },
    hourAggregate: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        {
          provide: StockRepository,
          useValue: mockStockRepository,
        },
        {
          provide: GranularityStrategy,
          useValue: mockGranularityStrategy,
        },
        {
          provide: AppDatabaseService,
          useValue: mockAppDatabaseService,
        },
      ],
    }).compile();

    service = module.get<StockService>(StockService);
  });

  it('should throw NotFoundException if stock does not exist', async () => {
    mockStockRepository.stockExists.mockResolvedValue(false);

    await expect(
      service.getOptimalTradeTime(1, new Date(), new Date(), Granularity.HOUR),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return the optimal trade time for a given stock, date range, and granularity:hourly', async () => {
    const mockData: UnifiedDataPoint[] = mockHourlyAggregateData;

    mockStockRepository.stockExists.mockResolvedValue(true);
    mockGranularityStrategy.streamData.mockReturnValueOnce([mockData]);

    const result = await service.getOptimalTradeTime(
      1,
      new Date('2022-01-01'),
      new Date('2022-01-02'),
      Granularity.HOUR,
    );

    let minPriceSoFar = Infinity;
    let maxProfit = 0;
    let optimalBuyTime = new Date('2022-01-01T00:00:00Z');
    let optimalSellTime = new Date('2022-01-01T00:00:00Z');

    for (let i = 0; i < mockData.length; i++) {
      const currentPrice = mockData[i].minPrice.toNumber();
      const potentialSellPrice = mockData[i].maxPrice.toNumber();

      if (currentPrice < minPriceSoFar) {
        minPriceSoFar = currentPrice;
        optimalBuyTime = mockData[i].timestamp;
      }

      const potentialProfit = potentialSellPrice - minPriceSoFar;
      if (potentialProfit > maxProfit) {
        maxProfit = potentialProfit;
        optimalSellTime = mockData[i].timestamp;
      }
    }

    expect(result.buyTime).toEqual(optimalBuyTime);
    expect(result.sellTime).toEqual(optimalSellTime);
    expect(result.maxProfit).toEqual(maxProfit);
  });

  it('should handle errors and throw InternalServerErrorException', async () => {
    mockStockRepository.stockExists.mockResolvedValue(true);
    mockGranularityStrategy.streamData.mockImplementationOnce(() => {
      throw new Error('Test Error');
    });

    await expect(
      service.getOptimalTradeTime(
        1,
        new Date('2022-01-01'),
        new Date('2022-01-10'),
        Granularity.HOUR,
      ),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should return SECOND granularity for date differences less than one day', () => {
    const result = service['determineGranularity'](
      new Date('2022-01-01T00:00:00Z'),
      new Date('2022-01-01T23:59:59Z'),
    );
    expect(result).toEqual(Granularity.SECOND);
  });

  it('should return MINUTE granularity for date differences less than or equal to 31 days', () => {
    const result = service['determineGranularity'](
      new Date('2022-01-01T00:00:00Z'),
      new Date('2022-02-01T00:00:00Z'),
    );
    expect(result).toEqual(Granularity.MINUTE);
  });

  it('should return HOUR granularity for all other date differences', () => {
    const result = service['determineGranularity'](
      new Date('2022-01-01T00:00:00Z'),
      new Date('2022-03-01T00:00:00Z'),
    );
    expect(result).toEqual(Granularity.HOUR);
  });
});
