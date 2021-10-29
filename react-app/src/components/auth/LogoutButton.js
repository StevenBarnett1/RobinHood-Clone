import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/session';
import {HiOutlineLogout} from "react-icons/hi"
import {BsDoorOpenFill} from "react-icons/bs"
import {useHistory} from "react-router-dom"

const LogoutButton = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const onLogout = async (e) => {
    await dispatch(logout());
    history.push("/")
  };

  return (<BsDoorOpenFill onClick={onLogout} style = {{fontSize:"25px",cursor:"pointer"}}/>);
};

export default LogoutButton;
