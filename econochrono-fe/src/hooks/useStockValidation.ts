import { Stock } from '../types'

export const useStockValidation = (stock: Stock) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const validateInputs = (
    inputFunds: number | null,
    startDate: Date | null,
    endDate: Date | null
  ): [boolean, string] => {
    if (!inputFunds || inputFunds <= 0) {
      return [false, 'Please input correct trade amount.']
    }

    if (
      startDate &&
      (startDate < new Date(stock.startDate) ||
        startDate > new Date(stock.endDate))
    ) {
      return [
        false,
        `Start date is not in range ${formatDate(
          stock.startDate
        )} to ${formatDate(stock.endDate)}`,
      ]
    }

    if (
      endDate &&
      (endDate < new Date(stock.startDate) || endDate > new Date(stock.endDate))
    ) {
      return [
        false,
        `End date is not in range ${formatDate(
          stock.startDate
        )} to ${formatDate(stock.endDate)}`,
      ]
    }

    return [true, '']
  }

  return validateInputs
}
