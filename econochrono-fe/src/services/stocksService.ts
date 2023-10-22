import { OptimalTradeStockResultDto } from '../types'

const BASE_URL = process.env.REACT_APP_API_URL

export const getStocks = async () => {
  const response = await fetch(`${BASE_URL}/stock`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const message = await response.text()
    console.log(message)
    throw new Error(`Failed to fetch stocks: ${message}`)
  }

  return await response.json()
}

export const getOptimalTradeTime = async (
  stockId: number,
  startDate: Date | null,
  endDate: Date | null
): Promise<OptimalTradeStockResultDto> => {
  const response = await fetch(
    `${BASE_URL}/stock/optimal-trade?stockId=${stockId}&startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  )

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Failed to fetch optimal trade time: ${message}`)
  }

  return await response.json()
}
