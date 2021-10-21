const SET_HOLDINGS = "stocks/SET_HOLDINGS"

export const getHoldings = () => async dispatch =>{
    const response = await fetch("/api/holdings")

    if (response.ok) {
        const holdings = await response.json();
        dispatch(setHoldings(holdings))
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
