const SET_STOCKS = "stocks/SET_STOCKS"
const SET_GRAPH_DATA = "stocks/SET_GRAPH_DATA"

export const getStocks = () => async dispatch =>{
    const response = await fetch("/api/stocks")

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

const setStockGraphData = data => {
  return {
    type:SET_GRAPH_DATA,
    payload:data
  }
}

export const getStockGraphData = (stocks,token) => async dispatch => {
  let start = new Date()
  let end = new Date()
  if(start.getDay() === 6){
      start.setDate(start.getDate()-1)
      end.setDate(end.getDate()-1)
      end.setHours(23,0,0,0)

  }
  if(start.getDay() === 0){
      start.setDate(start.getDate()-2)
      end.setDate(end.getDate()-2)
      end.setHours(23,0,0,0)
  }
  start.setHours(0,0,0,0)
  console.log("STOCKS IN STOCK GRAPH: ",stocks)
  let startUnix = Math.floor(Number(start.getTime() / 1000))
  let endUnix = Math.floor(Number(end.getTime() / 1000))
  for(let stock of stocks){
    stock.max = 0
    stock.min = Infinity
    stock.data = []
  }
  for(let stock of stocks){

    const candleResponse = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${stock.symbol}&resolution=15&from=${startUnix}&to=${endUnix}&token=${token}`)
    const priceResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=${token}`)

    const candleData = await candleResponse.json()
    const priceData = await priceResponse.json()
    stock.price = priceData.c
    for(let i = 0; i< candleData.c.length;i++){
      const newObj = {}
      if(candleData.c[i] > stock.max)stock.max = candleData.c[i]
      if(candleData.c[i] < stock.min)stock.min = candleData.c[i]
      newObj.unixTime = candleData.t[i]
      newObj.dateTime = new Date(newObj.unixTime * 1000)
      newObj.price = candleData.c[i]
      stock.data.push(newObj)
    }
  }
  console.log("STOCKS HERE: ",stocks)
  dispatch(setStockGraphData(stocks))
}

export const getIndividualStockGraphData = (stock,token) => async dispatch => {

}

const initialState = {}
export default function stocksReducer(state = initialState, action) {
    let newState = {...state}
    switch (action.type) {
      case SET_STOCKS:
          newState.stocks = action.payload

          return newState
        case SET_GRAPH_DATA:
          newState.watchlistStockData = {}
          for(let stock of action.payload){
            newState.watchlistStockData[stock.symbol] = stock
          }
          return newState
      default:
        return newState;
    }
  }
