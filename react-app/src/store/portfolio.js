const SET_PORTFOLIO_DATA = "portfolio/SET_PORTFOLIO_DATA"
const SET_MOVERS_DATA = "portfolio/SET_MOVERS_DATA"
const intervalMap = {
  "1":60,
  "5":300,
  "15":900,
  "30":1800,
  "60":3600,
  "D":86400,
  "W":604800,
}

export const setPortfolioData = (portfolioData) => {
  return {
    type:SET_PORTFOLIO_DATA,
    payload:portfolioData
  }
}

export const setMoversData = (losersData,gainersData) => {

  return {
    type:SET_MOVERS_DATA,
    gainersData,
    losersData
  }
}


export const getMoversData = (apiKeys) => async dispatch => {
  let newGainersData = []
  let newLosersData = []
  const losersResponse = await fetch(`https://financialmodelingprep.com/api/v3/losers?apikey=${apiKeys[Math.floor(Math.random()*apiKeys.length)]}`)
  let losersData = await losersResponse.json()
  if(losersData instanceof Array){
    newLosersData = [...losersData]
  }
  const gainersResponse = await fetch(`https://financialmodelingprep.com/api/v3/gainers?apikey=${apiKeys[Math.floor(Math.random()*apiKeys.length)]}`)
  let gainersData = await gainersResponse.json()
  if(gainersData instanceof Array){
    newGainersData = [...gainersData]
  }
  dispatch(setMoversData(newLosersData,newGainersData))
}


export const getPortfolioData = (holdings,resolution,unixStart,unixEnd,tokens) => async dispatch => {
  const portfolioData = {"max":0,"min":Infinity}
  let prices = []
  let dates = []
  let jMaxAllowed = Infinity
  let jMax = 0
  for(let i = 0 ; i< holdings.length;i++){
    const response = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${holdings[i].symbol}&resolution=${resolution}&from=${unixStart}&to=${unixEnd}&token=${tokens[Math.floor(Math.random()*tokens.length)]}`)

    const data = await response.json()

    if(data.c){
      for(let j = 0; j<data.c.length;j++){
        const newObject = {}

        if(i === 0){
          newObject.unixTime = data.t[j]
          newObject.dateTime = new Date(data.t[j] * 1000)
          newObject.price = holdings[i].shares*data.c[j]
          if(resolution === "D"){
            newObject.dateTime.setDate(newObject.dateTime.getDate()+1)
          }


          if((newObject.dateTime.getHours() > 6 && newObject.dateTime.getHours() < 13) || (newObject.dateTime.getMinutes() === 30 && newObject.dateTime.getHours() === 6) || resolution === "D" || resolution === "M"){
            prices.push(newObject)
          }

        } else {
          for(let k = 0 ; k < prices.length;k++){
            if(prices[k].unixTime === data.t[j]){
              prices[k].price += holdings[i].shares*data.c[j]
            }
          }
        }

      }
    }



  }

  let newData = []
  for(let i =0; i<prices.length;i++){

      if(prices[i].price > portfolioData.max)portfolioData.max = Number(prices[i].price.toFixed(0))
      if(prices[i].price < portfolioData.min)portfolioData.min = Number(prices[i].price.toFixed(0))

  }
  if(prices.length)portfolioData.data=prices
  else portfolioData.data = ["no_data"]
  dispatch(setPortfolioData(portfolioData))
}






const initialState = {}
export default function portfolioReducer(state = initialState, action) {
    let newState = {...state}
    switch (action.type) {
      case SET_PORTFOLIO_DATA:
          newState.portfolioData = action.payload

          return newState
        case SET_MOVERS_DATA:
          newState.moversData = {}
          newState.moversData.gainersData = action.gainersData
          newState.moversData.losersData = action.losersData
          return newState
      default:
        return newState;
    }
  }
