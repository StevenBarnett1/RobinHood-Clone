import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { signUp } from '../../store/session';
import "./Signup.css"
import { NavLink, Link } from 'react-router-dom';

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
          <form id = "signup-form" onSubmit={onSignUp}>
            <div>
              {errors.map((error, ind) => (
                <div key={ind}>{error}</div>
              ))}
            </div>
            <div id = "name-inputs">
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
              </div>

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
            <div><Link to = {{pathname:"https://brokercheck.finra.org/"}} target="_blank" className="signup-fine external">Check the background of Robinhood Financial LLC and Robinhood Securities, LLC on FINRA’s BrokerCheck.</Link></div>
            <div><Link to = {{pathname:"https://cdn.robinhood.com/assets/robinhood/legal/Robinhood%20Terms%20and%20Conditions.pdf"}} target="_blank" className="signup-fine external">Robinhood Terms & Conditions  Disclosure Library  Contact Us  FAQ</Link></div>
            <div className="signup-fine">© 2020 Robinhood. All rights reserved.</div>
          </div>

    </div>
    </div>
    <div id = "signup-right">
      <div id = "signup-right-inner">
        <div className = "signup-right-print">
          <div className = "signup-right-print-title">Commission-free trading</div>
          <div className = "signup-right-print-text">Break free from commission-fees and make unlimited commission-free trades in stocks, funds, and options with Robinhood Financial. Other fees may apply. View our fee schedule to learn more.</div>
        </div>
        <div className = "signup-right-print">
          <div className = "signup-right-print-title">Account Protection</div>
          <div className = "signup-right-print-text">Robinhood Financial is a member of SIPC. Securities in your account protected up to $500,000. For details, please see www.sipc.org.</div>
        </div>
        <div className = "signup-right-print">
          <div className = "signup-right-print-title">Stay on top of your portfolio</div>
          <div className = "signup-right-print-text">Set up customized news and notifications to stay on top of your assets as casually or as relentlessly as you like. Controlling the flow of info is up to you.</div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SignUpForm;
