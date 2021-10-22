const SET_PORTFOLIO_DATA = "portfolio/SET_PORTFOLIO_DATA"

const intervalMap = {
  "1":60,
  "15":900,
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

export const getPortfolioData = (holdings,resolution,unixStart,unixEnd,token) => async dispatch => {
  const portfolioData = {"max":0,"min":Infinity}
  let prices = []
  let dates = []
  for(let i = 0 ; i< holdings.length;i++){
    const response = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${holding[i].symbol}&resolution=${resolution}&from=${unixStart}&to=${unixEnd}&token=${token}`)
    const data = await response.json()
    for(let j = 0; j<data.c.length;j++){


      if(!prices[j]){
        prices[j] = user.holdings[i].shares*data.c[j]

      } else {
        prices[j] += user.holdings[i].shares*data.c[j]
      }

    }
  }
  let newData = []
  for(let i =0; i<prices.length;i++){
    const obj = {}
      let unixTime = unixStart + (i*intervalMap[resolution])
      let dateTime = new Date(unixTime * 1000)

      obj.dateTime = dateTime
      obj.unixTime = unixTime
      obj.price = prices[i]
      if(obj.price > portfolioData.max)portfolioData.max = obj.price
      if(obj.price < portfolioData.min)portfolioData.min = obj.price
      newData.push(obj)
  }
  portfolioData.data=newData
  dispatch(setPortfolioData(portfolioData))
}






const initialState = {}
export default function portfolioReducer(state = initialState, action) {
    let newState = {...state}
    switch (action.type) {
      case SET_PORTFOLIO_DATA:
          newState = action.payload
          return newState
      default:
        return newState;
    }
  }
