import { OptimalTradeStockResultDto } from '../types'

type StockResultTableProps = {
  result: OptimalTradeStockResultDto
}

const StockResultTable: React.FC<StockResultTableProps> = ({ result }) => {
  return (
    <table>
      <tbody>
        <tr>
          <td>
            <strong>Optimal Purchase Time:</strong>
          </td>
          <td>{new Date(result.buyTime).toLocaleString()}</td>
        </tr>
        <tr>
          <td>
            <strong>Purchase Price per Stock:</strong>
          </td>
          <td>${result.buyPrice.toFixed(2)}</td>
        </tr>
        <tr>
          <td>
            <strong>Optimal Sell Time:</strong>
          </td>
          <td>{new Date(result.sellTime).toLocaleString()}</td>
        </tr>
        <tr>
          <td>
            <strong>Sell Price per Stock:</strong>
          </td>
          <td>${result.sellPrice.toFixed(2)}</td>
        </tr>
        <tr>
          <td>
            <strong>Number of Stocks Bought:</strong>
          </td>
          <td>{result.numberOfStocks}</td>
        </tr>
        <tr>
          <td>
            <strong>Total Profit:</strong>
          </td>
          <td>${result.totalProfit.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  )
}

export default StockResultTable
