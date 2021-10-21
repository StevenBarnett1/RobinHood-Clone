
import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from '../auth/LogoutButton';
import "./Navigation.css"
import { useSelector } from 'react-redux';

const NavBar = () => {

  const user = useSelector(state => state.session.user)

  return (
    <nav id = "navbar-outer-container">
      <div id = "navbar-inner-container">
        {!user && (
          <>
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
        </>
        )}
        {user && (
          <div>
            <div>Robinhood Logo</div>
            <Search/>
            <LogoutButton />
          </div>
        )}



      </div>
    </nav>
  );
}

export default NavBar;
