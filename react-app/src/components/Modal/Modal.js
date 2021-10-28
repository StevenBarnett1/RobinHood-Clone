import React from 'react';
import { Modal } from '../../context/Modal';
import {useState} from "react"
import {useDispatch,useSelector} from "react-redux"
import {editWatchlistThunk, addWatchlistThunk, toggleModalView, addToWatchlist} from "../../store/session"
import {ImCross} from "react-icons/im"
import "./Modal.css"
function FormModal(props) {
  const dispatch = useDispatch()
  const [WatchlistInputValue,setWatchlistInputValue] = useState("")
  const [addWatchlist,setAddWatchlist] = useState("")
  const [createWatchlistInputValue,setCreateWatchlistInputValue] = useState("")
  const user = useSelector(state=>state.session.user)

  const modalType= useSelector((state)=>state.session.modalType)
  const modalView = useSelector(state => state.session.modalView)
  const modalInfo = useSelector(state => state.session.modalInfo)
  let userForm
  const handleEditSubmit = () => {
    if(WatchlistInputValue){
      dispatch(editWatchlistThunk(modalInfo.id,user.id,WatchlistInputValue))
    }

  }

  const handleCreateSubmit = ()=>{
    if(createWatchlistInputValue){
      dispatch(addWatchlistThunk(createWatchlistInputValue,user.id))
      setAddWatchlist(false)
    }
  }

  const handleAddToWatchlist = (watchlist) => {
    dispatch(addToWatchlist(watchlist.id,props.symbol))
  }

  if (modalView && modalType === "edit-watchlist"){
    userForm = (
    <form id = "edit-watchlist-form" onSubmit = {handleEditSubmit}>
      <div id = "edit-watchlist-form-upper">
        <div id = "edit-watchlist-title">Edit List</div>
        <div id = "exit-edit-watchlist"> <ImCross/> </div>
      </div>
      <input id = "edit-watchlist-input" value = {WatchlistInputValue} onChange = {e=>setWatchlistInputValue(e.target.value)}type = "text" id = "edit-watchlist-input"></input>
      <input id = "save-edit-watchlist" value = "Save" type = "submit"></input>
      </form>
      )
  } else if (modalView && modalType === "add-to-watchlist"){
    userForm = (
      <>
        {addWatchlist ? (
          <div id = "modal-create-watchlist-outer-container">
            <input type = "text" value = {createWatchlistInputValue} onChange = {(e)=>setCreateWatchlistInputValue(e.target.value)}></input>
            <div id = "modal-create-watchlist-buttons-container">
              <button onClick = {()=>setAddWatchlist(false)}>Cancel</button>
              <button onClick = {()=>handleCreateSubmit()}>Submit</button>
            </div>

          </div>
        ) : (
          <div id = "modal-create-watchlist" onClick = {()=>setAddWatchlist(true)}>Create New List</div>
        )}

        {user.watchlists && user.watchlists.map(watchlist => {

          return (<div onClick = {()=>handleAddToWatchlist(watchlist)}>{watchlist.name}</div>)
        })}
      </>
    )
  }



  return (
    <>
      {modalView && (
        <Modal onClose={() => dispatch(toggleModalView(false))}>
          {userForm}
        </Modal>
      )}
    </>
  );
}

export default FormModal;
