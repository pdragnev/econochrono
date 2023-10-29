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
    throw new Error(`Failed to fetch stocks: ${message}`)
  }

  return await response.json()
}

export const getOptimalTradeTime = async (
  stockId: number,
  startDate: Date | null,
  endDate: Date | null,
  amount: number | null
): Promise<OptimalTradeStockResultDto> => {
  const url = `${BASE_URL}/stock/optimal-trade?stockId=${encodeURIComponent(
    stockId.toString()
  )}&startDate=${encodeURIComponent(
    startDate?.toISOString() || ''
  )}&endDate=${encodeURIComponent(
    endDate?.toISOString() || ''
  )}&amount=${encodeURIComponent(amount || '')}`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(
      `Failed to fetch optimal trade time: ${JSON.stringify(errorData)}`
    )
  }

  return await response.json()
}
