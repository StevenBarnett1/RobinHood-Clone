export const addWatchlistThunk = (name,userId) => async dispatch => {
    const response = await fetch(`/api/watchlists`,{
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({name,user_id:userId})
    })
    const data = await response.json()
  }

  export const deleteWatchlistThunk = (id) => async dispatch => {
    const response = await fetch(`/api/watchlists/${id}`,{
      method:"DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const data = await response.json()
  }

  export const editWatchlistThunk = (id,userId,name) => async dispatch => {
    const response = await fetch(`/api/watchlists/${id}`,{
      method:"PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({user_id:userId,name})
    })
    const data = await response.json()
  }



  export default function watchlistReducer(state={},action){
    const newState = {...state}
    switch (action.type) {
    default:
      return newState;
  }
  }
