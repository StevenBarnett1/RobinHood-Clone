const SET_HOLDINGS = "stocks/SET_HOLDINGS"

export const addHolding = (symbol,shares,userId) => async dispatch =>{
    const response = await fetch("/api/holdings",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({symbol:symbol.toUpperCase(),user_id:userId,shares})
    })

    if (response.ok) {
        const holdings = await response.json();
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

export const sellHolding = (symbol,shares,userId) => async dispatch => {
    const response = await fetch("/api/holdings",{
      method:"PUT",
      headers:{
          "Content-Type":"application/json"
      },
      body:JSON.stringify({symbol:symbol.toUpperCase(),user_id:userId,shares})
  })
}

export const setHoldings = (holdings) => {
    return {
        type:SET_HOLDINGS,
        payload:holdings
    }
}
const initialState = {}

export default function holdingsReducer(state = initialState, action) {
    let newState = {...state}
    switch (action.type) {
      case SET_HOLDINGS:
          newState = action.payload
          console.log("PAYLOAD: ", action.payload)
          return newState
      default:
        return newState;
    }
  }
