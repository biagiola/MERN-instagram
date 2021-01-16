import React, { useState, useEffect } from 'react'
import { TextField, IconButton } from '@material-ui/core'
import './Login.css'
import ImageSlides from './ImageSlides'
import { auth } from '../../firebase'
import { actionTypes } from '../../Reducer'
import { useStateValue } from '../../StateProvider'
import PlayStore from '../../assets/playStore.png'
import AppStore from '../../assets/appStore.png'

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

  const handleSignUp = () => {
    
  }

  return (
    <div className="login__page">
      <div className="login__page__top">
        {/* left */}
        <div className="login__page__left">
          <ImageSlides/>
        </div>
        {/* right */}
        <div className="login__page__right">
          <div className="login__signIn__form">
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
                onClick={handleLogin}
                className="login__botton">
                  Log In
              </button>
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

          <div className="getTheApp">Get the app.</div>
          <div className="google__apple__stores">
            <img src={PlayStore} width="128px"/>
            <img src={AppStore} width="128px"/>
          </div>
        </div>
      </div>

      <div className="login__footer">
        <ul>
          <ul>
            <li>About</li>
            <li>Blog</li>
            <li>Jobs</li>
            <li>Help</li>
            <li>API</li>
            <li>Privacy</li>
            <li>Terms</li>
            <li>Top Accounts</li>
            <li>Hashtags</li>
            <li>Locations</li>
          </ul>
          <ul>
            <li>Beauty</li>
            <li>Dance & Performance</li>
            <li>Fitness</li>
            <li>Food & Drink</li>
            <li>Home & Garden</li>
            <li>Music</li>
            <li>Visual Arts</li>
          </ul>
        </ul>
      </div>
    </div>
  )
}

export default Login
