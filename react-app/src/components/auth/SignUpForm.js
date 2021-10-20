import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { signUp } from '../../store/session';
import "./Signup.css"
import { NavLink } from 'react-router-dom';

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName,setLastName] = useState("")
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
      const data = await dispatch(signUp(firstName, lastName, email, password));
      if (data) {
        setErrors(data)
      }
  };

  const updateFirstName = (e) => {
    setFirstName(e.target.value);
  };

  const updateLastName = (e) => {
    setLastName(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div id = "signup-outer">
      <div id = "signup-left">
        <div id = "signup-left-inner">
          <div id = "signup-title">Robbinghood</div>
          <div id = "signup-subtitle-container">
            <div id = "signup-subtitle-heading">Make Your Money Move</div>
            <div id = "signup-subtitle-text">Robinhood lets you invest in companies you love, commission-free.</div>
          </div>
          <div id = "signup-form-prevalidation">Please enter your full legal name. Your legal name should match any form of government ID.</div>
          <form onSubmit={onSignUp}>
            <div>
              {errors.map((error, ind) => (
                <div key={ind}>{error}</div>
              ))}
            </div>
              <input
                type='text'
                name='first_name'
                onChange={updateFirstName}
                value={firstName}
                placeholder = "First name"
                required
              ></input>
              <input
                type='text'
                name='last_name'
                onChange={updateLastName}
                value={lastName}
                placeholder = "Last name"
                required
              ></input>


              <input
                type='text'
                name='email'
                onChange={updateEmail}
                value={email}
                placeholder = "Email"
                required
              ></input>

              <input
                type='password'
                name='password'
                onChange={updatePassword}
                value={password}
                placeholder = "Password(min. 10 characters)"
                required
              ></input>

            <div id = "signup-button-container">
            <button type='submit'>Continue</button>
            <div id = "signup-button-links-container">
              <div>Already started?</div>
              <NavLink to = "/login">Log in to complete your application</NavLink>
            </div>
            </div>

          </form>
          <div id = "signup-fineprint">
            <div className="signup-fine">All investments involve risk, including the possible loss of principal. Investors should consider their investment objectives and risks carefully before investing.</div>
            <div className="signup-fine">Commission-free trading means $0 commission trading on self-directed individual cash or margin brokerage accounts that trade U.S. listed securities via mobile devices or web. Keep in mind, other fees such as trading (non-commission) fees, Gold subscription fees, wire transfer fees, and paper statement fees may apply to your brokerage account. Please see Robinhood Financial’s fee schedule to learn more.</div>
            <div className="signup-fine">Securities trading offered through Robinhood Financial LLC. Brokerage clearing services offered through Robinhood Securities, LLC. Both are subsidiaries of Robinhood Markets, Inc.</div>
            <div className="signup-fine external">Check the background of Robinhood Financial LLC and Robinhood Securities, LLC on FINRA’s BrokerCheck.</div>
            <div className="signup-fine external">Robinhood Terms & Conditions  Disclosure Library  Contact Us  FAQ</div>
            <div className="signup-fine">© 2020 Robinhood. All rights reserved.</div>
          </div>

    </div>
    </div>
    <div id = "signup-right"></div>
    </div>
  );
};

export default SignUpForm;
