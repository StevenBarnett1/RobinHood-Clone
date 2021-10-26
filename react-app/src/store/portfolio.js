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


export const getMoversData = (apiKey) => async dispatch => {
  const losersResponse = await fetch(`https://financialmodelingprep.com/api/v3/losers?apikey=${apiKey}`)
  const losersData = await losersResponse.json()

  const gainersResponse = await fetch(`https://financialmodelingprep.com/api/v3/gainers?apikey=${apiKey}`)
  const gainersData = await gainersResponse.json()
  dispatch(setMoversData(losersData,gainersData))
}
export const getPortfolioData = (holdings,resolution,unixStart,unixEnd,token) => async dispatch => {
  const portfolioData = {"max":0,"min":Infinity}
  console.log("FHDHDH",resolution,unixStart,unixEnd)
  let prices = []
  let dates = []
  let jMaxAllowed = Infinity
  let jMax = 0
  for(let i = 0 ; i< holdings.length;i++){
    const response = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${holdings[i].symbol}&resolution=${resolution}&from=${unixStart}&to=${unixEnd}&token=${token}`)
    console.log(`https://finnhub.io/api/v1/stock/candle?symbol=${holdings[i].symbol}&resolution=${resolution}&from=${unixStart}&to=${unixEnd}&token=${token}`)
    const data = await response.json()

    // console.log("PRICES: ",prices)
    for(let j = 0; j<data.c.length;j++){
      const newObject = {}
      // console.log("DATA.C",data.c.length,data.c[j],new Date(data.t[j] * 1000))
      // if(j > jMax)jMax = j
      // if(j === data.c.length-1 && j < jMaxAllowed)jMaxAllowed = j

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
    // let oldPrices = [...prices]
    // prices = prices.slice(0,jMaxAllowed+1)
    // console.log("JMAX HERE: ",jMax, "JMAX ALLOWED HERE: ",jMaxAllowed)
    // for(let i = jMaxAllowed+1; i<jMax+1;i++){
    //   prices.push(prices[prices.length-1])
    // }

  }
  let newData = []
  for(let i =0; i<prices.length;i++){

    // console.log("DATETIME: ",dateTime)

      if(prices[i].price > portfolioData.max)portfolioData.max = Number(prices[i].price.toFixed(0))
      if(prices[i].price < portfolioData.min)portfolioData.min = Number(prices[i].price.toFixed(0))

  }
  portfolioData.data=prices
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
