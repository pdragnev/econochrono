import './App.css'
import { useStocks } from './hooks/useStocks'
import StockComponent from './components/StockComponent'

function App() {
  const { stocks, error } = useStocks()

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
