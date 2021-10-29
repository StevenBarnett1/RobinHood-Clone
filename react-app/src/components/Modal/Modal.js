import React from 'react';
import { Modal } from '../../context/Modal';
import {useState} from "react"
import {useDispatch,useSelector} from "react-redux"
import {editWatchlistThunk, addWatchlistThunk, toggleModalView, addToWatchlist} from "../../store/session"
import {ImCross} from "react-icons/im"
import {AiOutlinePlus} from "react-icons/ai"
import {GrCheckmark} from "react-icons/gr"
import "./Modal.css"
function FormModal(props) {
  const dispatch = useDispatch()
  const [WatchlistInputValue,setWatchlistInputValue] = useState("")
  const [addWatchlist,setAddWatchlist] = useState("")
  const [createWatchlistInputValue,setCreateWatchlistInputValue] = useState("")
  const [checkedBoxes,setCheckedBoxes] = useState([])
  const user = useSelector(state=>state.session.user)

  const modalType= useSelector((state)=>state.session.modalType)
  const modalView = useSelector(state => state.session.modalView)
  const modalInfo = useSelector(state => state.session.modalInfo)
  const theme = useSelector(state=> state.session.theme)
  let userForm
  console.log("PROPS: ",props,)
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

  const changeCheckedBoxes = (watchlist) => {
    let newBoxes = []
    let oldBoxes = [...checkedBoxes]
    if(!oldBoxes.includes(watchlist.id)){
      newBoxes = [...oldBoxes]
      newBoxes.push(watchlist.id)
    }
    else {
      for(let i =0; i<oldBoxes.length;i++){
        if(oldBoxes[i] !== watchlist.id){
          console.log("IN HERE: ",oldBoxes[i])
          newBoxes.push(oldBoxes[i])
        }
      }
    }
    console.log("WATCHLIST ID: ",watchlist.id)
    console.log("OLD BOXES: ",oldBoxes)
    console.log("NEW BOXES: ",newBoxes)
    setCheckedBoxes(newBoxes)
  }

  const handleAddToWatchlist = () => {
    if(checkedBoxes.length){
      dispatch(addToWatchlist(checkedBoxes,props.symbol))
      dispatch(toggleModalView(false))
      setCheckedBoxes([])
    }

  }
  if (modalView && modalType === "edit-watchlist"){
    userForm = (
    <form id = "edit-watchlist-form" onSubmit = {handleEditSubmit} style = {theme === "dark" ? {color:"white",backgroundColor:"rgb(30, 33, 36)"}: {}}>
      <div id = "edit-watchlist-form-upper">
        <div id = "edit-watchlist-title">Edit List</div>
        <div id = "exit-edit-watchlist" onClick = {()=>dispatch(toggleModalView(false))}> <ImCross/> </div>
      </div>
      <input id = "edit-watchlist-input" placeholder = "New Name" value = {WatchlistInputValue} onChange = {e=>setWatchlistInputValue(e.target.value)}type = "text" id = "edit-watchlist-input" style = {theme ==="light" ? {backgroundColor:"rgb(247, 247, 247)"} : {color:"white",backgroundColor:"rgb(48, 48, 48)"}}></input>
      <input id = {props.performance ? "save-edit-watchlist-good" : "save-edit-watchlist-bad"} value = "Save" type = "submit" style = {theme === "light" ? {color:"black"} : {color:"white"}}></input>
      </form>
      )
  } else if (modalView && modalType === "add-to-watchlist"){
    userForm = (
      <div id = "add-to-watchlist-outer" style = {theme === "dark" ? {color:"white",backgroundColor:"rgb(30, 33, 36)"}: {}}>
          <div id = "add-to-watchlist-upper">
              <div id = "add-to-watchlist-title">Add {props.symbol.toUpperCase()} to Your Lists</div>
              <div id = "exit-add-to-watchlist" onClick = {()=>dispatch(toggleModalView(false))}> <ImCross/> </div>
            </div>
            <div id ='add-to-watchlist-inner'>
        {addWatchlist ? (
          <div id = "create-watchlist-outer-container">
            <input type = "text" value = {createWatchlistInputValue} onChange = {(e)=>setCreateWatchlistInputValue(e.target.value)}></input>
            <div id = "create-watchlist-buttons-container">
              <button onClick = {()=>setAddWatchlist(false)}>Cancel</button>
              <button onClick = {()=>handleCreateSubmit()}>Submit</button>
            </div>

          </div>
        ) : (
          <div className = {theme === "light" ? "add-to-watchlist-individual-light" : "add-to-watchlist-individual-dark"} id = "modal-create-watchlist" onClick = {()=>setAddWatchlist(true)}>
            <div style = {props.performance ? {backgroundColor:"rgb(216, 245, 216)"} : {backgroundColor:"rgb(252, 234, 225)"}} className = "square-box square-box-add"><AiOutlinePlus style = {{fontSize:"30px"}}/></div>
            <div>Create New List</div>
            </div>
        )}

        {user.watchlists && user.watchlists.map(watchlist => {

          return (<div key = {watchlist.id} className = {theme === "light" ? "add-to-watchlist-individual-light" : "add-to-watchlist-individual-dark"} onClick = {()=>{changeCheckedBoxes(watchlist)}}>
            <div className = {checkedBoxes.includes(watchlist.id) ? "checkmark-box-container-checked" : "checkmark-box-container-unchecked"} style = {props.performance  ? {border:"1px solid rgb(0, 200, 5)"} : { border:"1px solid rgb(255, 80, 0)"}}>
              {checkedBoxes.includes(watchlist.id) ? (<GrCheckmark/>) : null}
            </div>
            <div className = "square-box" style = {props.performance ? {backgroundColor:"rgb(216, 245, 216)"} : {backgroundColor:"rgb(252, 234, 225)"}}></div>
            <div className = "watchlist-data-container">
              <div className ="watchlist-list-name">{watchlist.name}</div>
              <div className = "watchlist-stock-length" style = {theme === "dark" ? {color:"white"}: {}}>{watchlist.stocks.length} items</div>
            </div>
            </div>)
        })}
        <button onClick = {()=>handleAddToWatchlist()} id = {props.performance ? "add-to-watchlist-save-good" : "add-to-watchlist-save-bad"} style = {theme === "light" ? {color:"white"} : {color:"black"}}>Save Changes</button>
        </div>
      </div>
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
