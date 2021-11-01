// constants
const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';
const TOGGLE_THEME = "session/TOGGLE_THEME"
const ADD_MODAL_TYPE = "session/ADD_MODAL_TYPE"
const MODAL_VIEW = "session/MODAL_VIEW"
const MODAL_REQUIRED = "session/MODAL_REQUIRED"
const MODAL_INFO = "session/MODAL_INFO"
const SET_HOLDINGS = "session/SET_HOLDINGS"

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER,
})

export const setTheme = () => {
  return {
    type: TOGGLE_THEME
  }
}

export const addBuyingPower = (id,buyingPower) => async dispatch => {
  const response = await fetch(`/api/users/${id}`,{
    method:"PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({buyingPower})
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data))
    if (data.errors) {
      return;
    }
  }

}

export const addModal = (type) => {
  return {
    type:ADD_MODAL_TYPE,
    payload:type
  }
}

export const toggleModalView = (visible) => {
  return {
    type:MODAL_VIEW,
    payload:visible
  }
}


export const addModalInfo = info => {
  return {
    type:MODAL_INFO,
    payload:info
  }
}



export const authenticate = () => async (dispatch) => {
  const response = await fetch('/api/auth/', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }

    dispatch(setUser(data));
  }
}

export const login = (email, password) => async (dispatch) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });


  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data))
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

export const logout = () => async (dispatch) => {
  const response = await fetch('/api/auth/logout', {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (response.ok) {
    dispatch(removeUser());
  }
};


export const signUp = (first_name, last_name, email, password) => async (dispatch) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      first_name,
      last_name,
      email,
      password,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data))
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

export const addWatchlistThunk = (name,userId) => async dispatch => {
  const response = await fetch(`/api/watchlists`,{
    method:"POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({name,user_id:userId})
  })
  const data = await response.json()
  dispatch(setUser(data))
}

export const deleteWatchlistThunk = (id) => async dispatch => {
  console.log("WATCHLIST HEREEEE: ",id)
  const response = await fetch(`/api/watchlists/${Number(id)}`,{
    method:"DELETE",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  if(response){
    const data = await response.json()
    if(data)dispatch(setUser(data))
  }

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
  dispatch(setUser(data))
}

export const addToWatchlist = (ids,symbol) => async dispatch => {
  let response
  for(let id of ids){
    console.log("ID HERE: ",id)
    response = await fetch(`/api/watchlists/${id}`,{
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({symbol})
    })
  }
  if(response){
    const data = await response.json()
    dispatch(setUser(data))
  }

}

const initialState = { user: null,theme:"light",modalView:null,modalType:null,modalInfo:null};

export const addHolding = (symbol,shares,userId) => async dispatch =>{
  if(!shares || !symbol || !userId)return 
    const response = await fetch("/api/holdings",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({symbol:symbol.toUpperCase(),user_id:userId,shares})
    })

    const data = await response.json()
    dispatch(setUser(data))
}

export const sellHolding = (symbol,shares,userId) => async dispatch => {
    const response = await fetch("/api/holdings",{
      method:"PUT",
      headers:{
          "Content-Type":"application/json"
      },
      body:JSON.stringify({symbol:symbol.toUpperCase(),user_id:userId,shares})
  })
  const data = await response.json()
  dispatch(setUser(data))
}

// export const setHoldings = (holdings) => {
//     return {
//         type:SET_HOLDINGS,
//         payload:holdings
//     }
// }
// const initialState = {}


export const deleteWatchlistStock = (id,symbol,user_id) => async dispatch => {
  const response = await fetch(`/api/watchlists/${id}/stocks/${symbol}`,{
    method:"DELETE",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({user_id})
  })
  const data = await response.json()
  dispatch(setUser(data))

}



export default function reducer(state = initialState, action) {
  const newState = {...state}
  switch (action.type) {
      case SET_USER:
        newState.user = action.payload
        return newState
      case REMOVE_USER:
        newState.user = null
        return newState
      case TOGGLE_THEME:
        console.log("IN REDUX STATE INITIAL THEME: ",newState.theme)
        if(newState.theme === "light"){
          newState.theme = "dark"
        } else newState.theme = "light"
        console.log("IN REDUX STATE INITIAL THEME: ",newState.theme)
        return newState
      case ADD_MODAL_TYPE:{
        newState.modalType=action.payload
        return newState
      }
      case MODAL_VIEW:{
        newState.modalView=action.payload
        return newState
      }
      case MODAL_REQUIRED:{
        newState.modalRequired=action.payload
        return newState
      }
      case MODAL_INFO:{
        newState.modalInfo = action.payload
        return newState
      }

    default:
      return newState;
  }
}
