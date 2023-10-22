import { useState } from 'react'
import { OptimalTradeStockResultDto, Stock } from '../types'
import { getOptimalTradeTime } from '../services/stocksService'

type StockProps = {
  stock: Stock
}

const StockComponent: React.FC<StockProps> = ({ stock }) => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [result, setResult] = useState<OptimalTradeStockResultDto | null>(null)

  const handleCalculation = async () => {
    try {
      const data = await getOptimalTradeTime(stock.stockId, startDate, endDate)
      setResult(data)
    } catch (error) {
      console.error('Error fetching optimal trade time:', error)
    }
  }

  return (
    <div>
      <h2>{stock.stockId}</h2>
      <h2>{stock.stockName}</h2>
      <p>
        Available data from: {new Date(stock.startDate).toLocaleDateString()} to{' '}
        {new Date(stock.endDate).toLocaleDateString()}
      </p>
      <input
        type="date"
        value={startDate ? startDate.toISOString().split('T')[0] : ''}
        onChange={(e) => setStartDate(new Date(e.target.value))}
        min={stock.startDate.split('T')[0]}
        max={stock.endDate.split('T')[0]}
      />
      <input
        type="date"
        value={endDate ? endDate.toISOString().split('T')[0] : ''}
        onChange={(e) => setEndDate(new Date(e.target.value))}
        min={stock.startDate.split('T')[0]}
        max={stock.endDate.split('T')[0]}
      />
      <button onClick={handleCalculation}>Calculate</button>
      {result && (
        <div>
          <h3>Optimal Trade Results</h3>
          <ul>
            <li>
              <strong>Optimal Purchase Time:</strong>{' '}
              {new Date(result.buyTime).toLocaleString()}
            </li>
            <li>
              <strong>Optimal Sell Time:</strong>{' '}
              {new Date(result.sellTime).toLocaleString()}
            </li>
            <li>
              <strong>Max Profit:</strong> ${result.maxProfit.toFixed(2)}
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default StockComponent
