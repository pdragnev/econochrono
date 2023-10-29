import { useState } from 'react'
import { OptimalTradeStockResultDto, Stock } from '../types'
import { getOptimalTradeTime } from '../services/stocksService'
import StockInputFields from './StockInputFields'
import StockResultTable from './StockResultTable'
import { useStockValidation } from '../hooks/useStockValidation'
import ReactModal from 'react-modal'

type StockProps = {
  stock: Stock
}

const StockComponent: React.FC<StockProps> = ({ stock }) => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [inputFunds, setInputFunds] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const validateInputs = useStockValidation(stock)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [result, setResult] = useState<OptimalTradeStockResultDto | null>(null)

  const handleCalculation = async () => {
    setErrorMessage(null)

    const [isValid, errorMessage] = validateInputs(
      inputFunds,
      startDate,
      endDate
    )
    if (!isValid) {
      setErrorMessage(errorMessage)
      return
    }
    try {
      const result = await getOptimalTradeTime(
        stock.stockId,
        startDate,
        endDate,
        inputFunds
      )
      if (result) {
        setResult(result)
        setIsModalOpen(true)
      }
    } catch (error) {
      setErrorMessage('Error fetching optimal trade time')
    }
  }

  return (
    <div className="stock-container">
      <div className="row">
        <label>Stock Name</label>
        <div>{stock.stockName}</div>
      </div>
      <div className="date-row row">
        <label>Available Start Date</label>
        <div>{new Date(stock.startDate).toLocaleDateString()}</div>
      </div>
      <div className="date-row row">
        <label>Available End Date</label>
        <div>{new Date(stock.endDate).toLocaleDateString()}</div>
      </div>
      <StockInputFields
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        inputFunds={inputFunds}
        setInputFunds={setInputFunds}
      />
      <button className="calculate-btn" onClick={handleCalculation}>
        Calculate
      </button>
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            padding: '20px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            background: '#ffffff',
          },
        }}
      >
        <h3>Optimal Trade Results</h3>
        <StockResultTable result={result!} />
        <button onClick={() => setIsModalOpen(false)}>Close</button>
      </ReactModal>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  )
}

export default StockComponent
