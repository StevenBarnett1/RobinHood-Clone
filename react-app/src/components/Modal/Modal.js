import React from 'react';
import { Modal } from '../../context/Modal';

import {toggleModalView} from "../../store/session"
import {useDispatch,useSelector} from "react-redux"

function FormModal() {
  const dispatch = useDispatch()
  const modalType= useSelector((state)=>state.session.modalType)
  const modalView = useSelector(state => state.session.modalView)
  let userForm

  if (modalView && modalType === "watchlist-dots"){
      userForm = (<h1>Watchlist dots area</h1>)
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
