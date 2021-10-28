
import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from '../auth/LogoutButton';
import "./Navigation.css"
import { useSelector } from 'react-redux';
import Search from '../Search';
import {HiOutlineLogout} from "react-icons/hi"
import svgfile from "./robinhood.svg";

const NavBar = () => {

  const user = useSelector(state => state.session.user)

  return (
    <nav id = "navbar-outer-container">
        {!user && (
          <div className = "navbar-inner-container">
          <div className = "navbar-left">
            <NavLink id = "navbar-title"className = "navbar-navlink" to='/' exact={true} activeClassName='active'>
              Robinhood
            </NavLink>
          </div>
          <div className = "navbar-right">
            <div>
              <NavLink id = "navbar-login-navlink" className = "navbar-navlink user-button" to='/login' exact={true} activeClassName='active'>
                Login
              </NavLink>
            </div>
            <div id = "navbar-user-buttons-spacer"></div>

              <NavLink id = "navbar-signup-navlink" className = "navbar-navlink user-button" to='/sign-up' exact={true} activeClassName='active'>
                Sign Up
              </NavLink>

          </div>
        </div>
        )}
        {user && (
          <div className = "navbar-inner-container">
            <NavLink to = "/"><img id = "robinhood-logo" src={svgfile} width = {80} height = {80} alt="some file" /></NavLink>
            <Search/>
            <LogoutButton />
          </div>
        )}
    </nav>
  );
}

export default NavBar;
