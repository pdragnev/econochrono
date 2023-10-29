import './App.css'
import { useStocks } from './hooks/useStocks'
import StockComponent from './components/StockComponent'
import ReactModal from 'react-modal'
import { useEffect } from 'react'

function App() {
  const { stocks, error } = useStocks()
  useEffect(() => {
    ReactModal.setAppElement('#root')
  }, [])

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      {stocks.map((stock) => (
        <StockComponent key={stock.stockId} stock={stock} />
      ))}
    </div>
  )
}

export default App
