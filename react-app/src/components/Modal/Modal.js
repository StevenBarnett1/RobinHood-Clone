import React from 'react';
import { Modal } from '../../context/Modal';
import {useState} from "react"
import {toggleModalView} from "../../store/session"
import {useDispatch,useSelector} from "react-redux"
import {editWatchlistThunk} from "../../store/session"

function FormModal() {
  const dispatch = useDispatch()
  const [WatchlistInputValue,setWatchlistInputValue] = useState("")
  const user = useSelector(state=>state.session.user)

  const modalType= useSelector((state)=>state.session.modalType)
  const modalView = useSelector(state => state.session.modalView)
  const modalInfo = useSelector(state => state.session.modalInfo)
  let userForm
  const handleEditSubmit = () => {
    dispatch(editWatchlistThunk(modalInfo.id,user.id,WatchlistInputValue))
  }
  if (modalView && modalType === "watchlist-dots"){
      userForm = (<h1>Watchlist dots area</h1>)
  } else if (modalView && modalType === "edit-watchlist"){
    userForm = (
    <form onSubmit = {handleEditSubmit}>
      <input value = {WatchlistInputValue} onChange = {e=>setWatchlistInputValue(e.target.value)}type = "text" id = "edit-watchlist-input"></input>
      <input value = "Submit" type = "submit"></input>
      </form>
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
