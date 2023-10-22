import { useState, useEffect } from 'react'
import { getStocks } from '../services/stocksService'
import { Stock } from '../types'

export const useStocks = () => {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await getStocks()
        setStocks(data)
      } catch (err) {
        setError('Failed to fetch stocks')
      }
    }

    fetchStocks()
  }, [])

  return { stocks, error }
}
