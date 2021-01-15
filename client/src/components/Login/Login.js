import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import './Login.css'
import ImageSlides from './ImageSlides'
import { auth } from '../../firebase'
import { actionTypes } from '../../Reducer'
import { useStateValue } from '../../StateProvider'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [{ userName }, dispatch] = useStateValue()

  // listening for auth changes
  useEffect(() => {
    console.log('authState changed hola')
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        // user is logged in...
        console.log('authUser.displayName' ,authUser.displayName)
        setUser(authUser)
        
        dispatch({
          type: actionTypes.SET_USER,
          user: authUser.displayName
        })

        console.log('user context', userName)

        if (authUser.displayName) {
          // dont update username
        } else {
          return authUser.updateProfile({
            displayName: userName,
          });
        }
      } else {
        setUser(null);
        dispatch({
          type: actionTypes.SET_USER,
          user: null
        })
      }
    })

    return () => {
     unsubscribe();
    };
  }, [userName])

  const handleLogin = (e) => {
    e.preventDefault()
    
    auth
      .signInWithEmailAndPassword(email, password)
      .then(result => {
        // save users data to allow keep user login when refresh the page
        localStorage.setItem('user', JSON.stringify(result.user))
      })
      .catch((error) => alert(error.message));
  }

  const handleSignUp = () => {}

  return (
    <div className="login__page">
      <div className="login__page__left">
        <ImageSlides/>
      </div>
      <div className="login__page__right">
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
