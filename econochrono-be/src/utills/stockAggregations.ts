import { PrismaClient } from '@prisma/client';

export async function generateMinuteAggregates(
  prisma: PrismaClient,
  stockId: number,
): Promise<void> {
  let lastProcessedTimestamp: Date | null = null;

  while (true) {
    const prices = await prisma.priceHistory.findMany({
      where: {
        stockId: stockId,
        ...(lastProcessedTimestamp
          ? { timestamp: { gt: lastProcessedTimestamp } }
          : {}),
      },
      orderBy: {
        timestamp: 'asc',
      },
      take: 3600, // Process 3600seconds = 60minutes
    });

    if (prices.length === 0) break;

    for (let i = 0; i < prices.length; i += 60) {
      const oneMinuteData = prices.slice(i, i + 60);
      if (oneMinuteData.length === 0) continue;

      const minPrice = Math.min(...oneMinuteData.map((p) => Number(p.price)));
      const maxPrice = Math.max(...oneMinuteData.map((p) => Number(p.price)));

      await prisma.minuteAggregate.create({
        data: {
          stockId: stockId,
          timestamp: oneMinuteData[0].timestamp,
          minPrice: minPrice,
          maxPrice: maxPrice,
        },
      });
    }

    lastProcessedTimestamp = prices[prices.length - 1].timestamp;
  }
}

export async function generateHourAggregates(
  prisma: PrismaClient,
  stockId: number,
): Promise<void> {
  let lastProcessedTimestamp: Date | null = null;

  while (true) {
    const minuteAggregates = await prisma.minuteAggregate.findMany({
      where: {
        stockId: stockId,
        ...(lastProcessedTimestamp && {
          timestamp: { gt: lastProcessedTimestamp },
        }),
      },
      orderBy: {
        timestamp: 'asc',
      },
      take: 60, // 60 minutes = 1 hour
    });

    if (minuteAggregates.length === 0) break;

    const minPrice = Math.min(
      ...minuteAggregates.map((p) => Number(p.minPrice)),
    );
    const maxPrice = Math.max(
      ...minuteAggregates.map((p) => Number(p.maxPrice)),
    );

    await prisma.hourAggregate.create({
      data: {
        stockId: stockId,
        timestamp: minuteAggregates[0].timestamp,
        minPrice: minPrice,
        maxPrice: maxPrice,
      },
    });

    lastProcessedTimestamp =
      minuteAggregates[minuteAggregates.length - 1].timestamp;
  }
}
