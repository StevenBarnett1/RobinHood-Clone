import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/Navigation/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import User from './components/User';
import { authenticate } from './store/session';
import SplashPage from './components/SplashPage';
import Dashboard from "./components/Dashboard"
import { getStocks } from './store/stocks';
import Search from './components/Search';
import "./index.css"
import StockPage from "./components/StockPage"
function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user)
  const theme = useSelector(state => state.session.theme)


  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <div id = {theme}>
      <Switch>
        <Route path='/login' exact={true}>
          <LoginForm />
        </Route>
        <Route path='/sign-up' exact={true}>
          <SignUpForm />
        </Route>
        {!user && (
          <Route path='/' exact={true} >
            <NavBar />
          <SplashPage/>
          </Route>
        )}
        {user && (
        <Route path='/' exact={true} >
          <NavBar />
          <Dashboard/>
        </Route>
        )}
        {user && (
          <Route exact = {true} path = "/stocks/:symbol">
            <NavBar />
            <StockPage/>
          </Route>
        )}
      </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
