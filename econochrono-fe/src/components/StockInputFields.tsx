type StockInputFieldsProps = {
  startDate: Date | null
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>
  endDate: Date | null
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>
  inputFunds: number | null
  setInputFunds: React.Dispatch<React.SetStateAction<number | null>>
}

const StockInputFields: React.FC<StockInputFieldsProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  inputFunds,
  setInputFunds,
}) => {
  return (
    <div>
      <input
        type="datetime-local"
        value={startDate ? startDate.toISOString().slice(0, -1) : ''}
        onChange={(e) => setStartDate(new Date(e.target.value))}
      />
      <input
        type="datetime-local"
        value={endDate ? endDate.toISOString().slice(0, -1) : ''}
        onChange={(e) => setEndDate(new Date(e.target.value))}
      />
      <label>
        Capital to Invest:
        <input
          type="number"
          placeholder="Enter amount"
          value={inputFunds || ''}
          onChange={(e) => setInputFunds(Number(e.target.value))}
        />
      </label>
    </div>
  )
}

export default StockInputFields
