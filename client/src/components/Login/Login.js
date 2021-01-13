import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {}

  const handleSignUp = () => {}
  
  return (
    <div className="login__page">
      <div className="login__page__left">
        <img
          src="https://www.instagram.com/static/images/homepage/home-phones.png/43cc71bb1b43.png"
          alt="phone"
        ></img>
      </div>
      <div className="login__page_right">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="logo"
        />
        <form action="" className="login__page__form">
          <TextField 
            id="outlined-basic" 
            label="Email" 
            variant="outlined"
            className="login__form__email"
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField 
            id="outlined-basic" 
            label="Password" 
            variant="outlined"
            className="login__form__password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button 
            disabled={!email}
            className="login__botton"
            onClick={handleLogin}
          >Log In</button>
        </form>
        <div className="login__divider">
          <hr/>
          <span className="or__divider">OR</span>
          <hr/>
        </div>
        <div className="signUp">
          <div className="signUp__title">Create an account</div>
          <button 
            disabled={!email}
            className="signUp__botton"
            onClick={handleSignUp}
          >Sign Up</button>
        </div>
      </div>
    </div>
  )
}

export default Login
