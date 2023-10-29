export interface Stock {
  stockId: number
  stockName: string
  startDate: string
  endDate: string
}

export interface OptimalTradeStockResultDto {
  buyTime: Date

  sellTime: Date

  buyPrice: number

  sellPrice: number

  numberOfStocks: number

  totalProfit: number
}
