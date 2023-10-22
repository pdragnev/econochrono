export interface Stock {
  stockId: number
  stockName: string
  startDate: string
  endDate: string
}

export interface OptimalTradeStockResultDto {
  buyTime: Date

  sellTime: Date

  maxProfit: number
}
