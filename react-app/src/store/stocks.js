const SET_STOCKS = "stocks/SET_STOCKS"

export const getStocks = () => async dispatch =>{
    const response = await fetch("/stocks")

    if (response.ok) {
        const stocks = await response.json();
        dispatch(setStocks(stocks))
        return null;
      } else if (response.status < 500) {
        const data = await response.json();
        if (data.errors) {
          return data.errors;
        }
      } else {
        return ['An error occurred. Please try again.']
      }
}

export const setStocks = (stocks) => {
    return {
        type:SET_STOCKS,
        payload:stocks
    }
}
const initialState = {}
export default function stocksReducer(state = initialState, action) {
    const newState = {...state}
    switch (action.type) {
      case SET_STOCKS:
          newState.stocks = action.payload
          return newState
      default:
        return newState;
    }
  }
