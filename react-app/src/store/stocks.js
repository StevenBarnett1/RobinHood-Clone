const SET_STOCKS = "stocks/SET_STOCKS"
const SET_STOCK_GRAPH_DATA = "stocks/SET_GRAPH_DATA"
const SET_WATCHLIST_GRAPH_DATA = "stocks/SET_WATCHLIST_GRAPH_DATA"
const SET_HOLDING_GRAPH_DATA = "stocks/SET_HOLDING_GRAPH_DATA"

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

const setHoldingGraphData = data => {
  return {
    type:SET_HOLDING_GRAPH_DATA,
    payload:data
  }
}

const setStockGraphData = data => {
  return {
    type:SET_STOCK_GRAPH_DATA,
    payload:data
  }
}

export const getHoldingGraphData = (stocks,tokens) => async dispatch => {
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
  } else if (start.getHours() < 6 || (start.getHours() === 6 && start.getMinutes() < 30)){

    if(start.getDate() === 1){
      start.setDate(start.getDate()-3)
      end.setDate(end.getDate()-3)
      end.setHours(23,0,0,0)
    }
    else {
      start.setDate(start.getDate()-1)
      end.setDate(end.getDate()-1)
      end.setHours(23,0,0,0)
    }
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

    const candleResponse = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${stock.symbol}&resolution=15&from=${startUnix}&to=${endUnix}&token=${tokens[Math.floor(Math.random()*tokens.length)]}`)
    const priceResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=${tokens[Math.floor(Math.random()*tokens.length)]}`)

    const candleData = await candleResponse.json()
    const priceData = await priceResponse.json()
    if(priceData){
      stock.price = priceData.c
    }
    if(candleData){
      if(candleData.c){
        if(candleData.c[0]){
          let num = stock.price - candleData.c[0]
          stock.change = (num / candleData.c[0])*100
        }
      }
    }

    if(candleData.c){
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

  }
  dispatch(setHoldingGraphData(stocks))
}


export const getWatchlistGraphData = (stocks,tokens) => async dispatch => {
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
  } else if (start.getHours() < 6 || (start.getHours() === 6 && start.getMinutes() < 30)){

    if(start.getDate() === 1){
      start.setDate(start.getDate()-3)
      end.setDate(end.getDate()-3)
      end.setHours(23,0,0,0)
    }
    else {
      start.setDate(start.getDate()-1)
      end.setDate(end.getDate()-1)
      end.setHours(23,0,0,0)
    }
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

    const candleResponse = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${stock.symbol}&resolution=15&from=${startUnix}&to=${endUnix}&token=${tokens[Math.floor(Math.random()*tokens.length)]}`)
    const priceResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=${tokens[Math.floor(Math.random()*tokens.length)]}`)

    const candleData = await candleResponse.json()
    const priceData = await priceResponse.json()
    stock.price = priceData.c

    if(candleData.c){
      let num = stock.price - candleData.c[0]
    stock.change = (num / candleData.c[0])*100
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

  }
  dispatch(setWatchlistGraphData(stocks))
}

export const getStockData = (symbol,resolution,unixStart,unixEnd,apiKeys,financialModelingPrepKeys,alphaAdvantageKeys) => async dispatch => {
  const stock = {"max":0,"min":Infinity,data:[],symbol:symbol,peers:[]}
  const candleResponse = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol.toUpperCase()}&resolution=${resolution}&from=${unixStart}&to=${unixEnd}&token=${apiKeys[Math.floor(Math.random()*apiKeys.length)]}`)
  const priceResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${apiKeys[Math.floor(Math.random()*apiKeys.length)]}`)
  const alphaAdvantageResponse = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${alphaAdvantageKeys[Math.floor(Math.random()*alphaAdvantageKeys.length)]}`)
  const financialModelingResponse = await fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${financialModelingPrepKeys[Math.floor(Math.random()*financialModelingPrepKeys.length)]}`)
  const peerResponse = await fetch(`https://finnhub.io/api/v1/stock/peers?symbol=${symbol.toUpperCase()}&token=${apiKeys[Math.floor(Math.random()*apiKeys.length)]}`)
  const earningsResponse = await fetch(`https://finnhub.io/api/v1/stock/earnings?symbol=${symbol.toUpperCase()}&token=${apiKeys[Math.floor(Math.random()*apiKeys.length)]}`)
    const candleData = await candleResponse.json()
    const priceData = await priceResponse.json()
    const alphaAdvantageData = await alphaAdvantageResponse.json()
    const financialModelingDataArray = await financialModelingResponse.json()
    const financialModelingData = financialModelingDataArray[0]
    const peerData = await peerResponse.json()
    const earningsData = await earningsResponse.json()

    if(alphaAdvantageData){
      stock.marketCap = alphaAdvantageData.MarketCapitalization === "None" ? "-" : alphaAdvantageData.MarketCapitalization
      stock.peRatio = alphaAdvantageData.PERatio === "None" ? "-" : alphaAdvantageData.PERatio
      stock.dividendYield = alphaAdvantageData.DividendYield === "None" ? "-" : alphaAdvantageData.DividendYield
      stock['52WeekHigh'] = alphaAdvantageData['52WeekHigh'] === "None" ? "-" : alphaAdvantageData['52WeekHigh']
      stock['52WeekLow'] = alphaAdvantageData['52WeekLow'] === "None" ? "-" : alphaAdvantageData['52WeekLow']
      stock.eps = alphaAdvantageData.EPS === "None" ? "-" : alphaAdvantageData.EPS
      stock.revenue = alphaAdvantageData.RevenueTTM === "None" ? "-" : alphaAdvantageData.RevenueTTM
    }
    if(financialModelingData){
      stock.description = financialModelingData.description
      stock.companyName = financialModelingData.companyName
      stock.volumeAverage = financialModelingData.volAvg
      stock.employees = financialModelingData.fullTimeEmployees === null ? "-" : financialModelingData.fullTimeEmployees
      if(financialModelingData.ceo){
        stock.ceo = financialModelingData.ceo.split(" ").slice(1).join(" ")
      } else stock.ceo = "-"
      if(!financialModelingData.city && !financialModelingData.state)stock.headquarters = "-"
    else if (!financialModelingData.city)stock.headquarters = financialModelingData.state[0].toUpperCase() + financialModelingData.state.slice(1).toLowerCase()
    else if (!financialModelingData.state)stock.headquarters = financialModelingData.city
    else stock.headquarters = `${financialModelingData.city}, ${financialModelingData.state[0].toUpperCase() + financialModelingData.state.slice(1).toLowerCase()}`
    }
    stock.earnings = earningsData
    stock.price = priceData.c

    if(stock.dividendYield == 0 )stock.dividendYield = "-"
    let estimated = []
    let actual = []

    if(stock.earnings){
      for(let i = stock.earnings.length-1; i>=0; i--){
        const mapper = {
          3:"Q3 FY20",
          2:"Q4 FY20",
          1:"Q1 FY21",
          0:"Q2 FY21"
        }
        const newEst = {'data':stock.earnings[i].estimate,'period':mapper[i]}
        const newAct = {'data':stock.earnings[i].actual,'period':mapper[i]}
        estimated.push(newEst)
        actual.push(newAct)
      }
    }

    stock.estimated = estimated
    stock.actual = actual

    if(peerData instanceof Array){
      for(let peer of peerData){

        const newObj = {}
        const peerPriceResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${peer.toUpperCase()}&token=${apiKeys[Math.floor(Math.random()*apiKeys.length)]}`)

        const peerPriceData = await peerPriceResponse.json()
        newObj.symbol = peer
        newObj.price = peerPriceData.c
        if((peer.toUpperCase() !== symbol.toUpperCase()) && newObj.price)stock.peers.push(newObj)
      }
    }

    if(candleData.c){
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
          case SET_HOLDING_GRAPH_DATA:
            newState.holdingStockData = {}
            for(let stock of action.payload){
              newState.holdingStockData[stock.symbol] = stock
            }
            return newState
      default:
        return newState;
    }
  }
