const SET_STOCKS = "stocks/SET_STOCKS"
const SET_STOCK_GRAPH_DATA = "stocks/SET_GRAPH_DATA"
const SET_WATCHLIST_GRAPH_DATA = "stocks/SET_WATCHLIST_GRAPH_DATA"

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

const setWatchlistGraphData = data => {
  return {
    type:SET_WATCHLIST_GRAPH_DATA,
    payload:data
  }
}

const setStockGraphData = data => {
  return {
    type:SET_STOCK_GRAPH_DATA,
    payload:data
  }
}

export const getWatchlistGraphData = (stocks,token) => async dispatch => {
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
  dispatch(setWatchlistGraphData(stocks))
}

export const getStockData = (symbol,resolution,unixStart,unixEnd,token,overviewToken) => async dispatch => {
  const stock = {"max":0,"min":Infinity,data:[],symbol:symbol,peers:[]}
  const candleResponse = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol.toUpperCase()}&resolution=${resolution}&from=${unixStart}&to=${unixEnd}&token=${token}`)
  const priceResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${token}`)
  const overviewResponse = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${overviewToken}`)
  const peerResponse = await fetch(`https://finnhub.io/api/v1/stock/peers?symbol=${symbol.toUpperCase()}&token=${token}`)
  const earningsResponse = await fetch(`https://finnhub.io/api/v1/stock/earnings?symbol=${symbol.toUpperCase()}&token=${token}`)
    const candleData = await candleResponse.json()
    const priceData = await priceResponse.json()
    const overviewData = await overviewResponse.json()
    const peerData = await peerResponse.json()
    const earningsData = await earningsResponse.json()
    console.log("MADE ANOTHER API CALL GET STOCK DATA")
    stock.earnings = earningsData
    stock.price = priceData.c
    stock.description = overviewData.Description
    stock.marketCap = overviewData.MarketCapitalization
    stock.peRatio = overviewData.PERatio
    stock.dividendYield = overviewData.DividendYield
    stock['52WeekHigh'] = overviewData['52WeekHigh']
    stock['52WeekLow'] = overviewData['52WeekLow']
    stock.eps = overviewData.EPS
    stock.revenue = overviewData.RevenueTTM

    for(let peer of peerData){
      const newObj = {}
      const peerPriceResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${peer.toUpperCase()}&token=${token}`)
      const peerPriceData = await peerPriceResponse.json()
      newObj.symbol = peer
      newObj.price = peerPriceData.c
      stock.peers.push(newObj)
    }

    for(let i = 0; i< candleData.c.length;i++){
      const newObj = {}
      if(candleData.c[i] > stock.max)stock.max = candleData.c[i]
      if(candleData.c[i] < stock.min)stock.min = candleData.c[i]
      newObj.unixTime = candleData.t[i]
      newObj.dateTime = new Date(newObj.unixTime * 1000)
      newObj.price = candleData.c[i]
      stock.data.push(newObj)
    }
    console.log("STOCK DATA IN THUNK: ",stock)
  dispatch(setStockGraphData(stock))
}

const initialState = {}
export default function stocksReducer(state = initialState, action) {
    let newState = {...state}
    switch (action.type) {
      case SET_STOCKS:
          newState.stocks = action.payload
      case SET_STOCK_GRAPH_DATA:
          newState.stockData = action.payload
          return newState
        case SET_WATCHLIST_GRAPH_DATA:
          newState.watchlistStockData = {}
          for(let stock of action.payload){
            newState.watchlistStockData[stock.symbol] = stock
          }
          return newState
      default:
        return newState;
    }
  }
