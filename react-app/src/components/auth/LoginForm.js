import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../../store/session';
import "./Login.css"

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div id = "login-page-outer-container">
      <div id = "left-side">
        <img id = "login-page-image" src = "https://cdn.robinhood.com/assets/generated_assets/632fcb3e7ed928b2a960f3e003d10b44.jpg"></img>
      </div>
      <div id = "right-side">
        <form onSubmit={onLogin}>
        <div>
          {errors.map((error, ind) => (
            <div key={ind}>{error}</div>
          ))}
        </div>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            name='email'
            type='text'
            placeholder='Email'
            value={email}
            onChange={updateEmail}
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            name='password'
            type='password'
            placeholder='Password'
            value={password}
            onChange={updatePassword}
          />
          <button type='submit'>Login</button>
        </div>
      </form>
      </div>

    </div>
  );
};

export default LoginForm;
