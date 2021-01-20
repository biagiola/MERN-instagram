import React, { useState, useEffect } from 'react'
import { Button, TextField, Input, makeStyles, Modal, Fade, Backdrop } from '@material-ui/core'
import './Login.css'
import ImageSlides from './ImageSlides'
import { auth } from '../../firebase'
import { actionTypes } from '../../Reducer'
import { useStateValue } from '../../StateProvider'
import PlayStore from '../../assets/playStore.png'
import AppStore from '../../assets/appStore.png'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    height: "150px",
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "absolute",
    width: 300,
    backgroundColor: theme.palette.background.paper,
    border: "0",
    borderRadius: "15px",
    boxShadow: theme.shadows[5],
    padding: "35px",
  },
  signUpForm: {
    dispplay: "flex",
    flexDirection: "column",
    
  },
  inputs: {
    display: "flex",
    flexDirection: "column"
  },
  button: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    paddingTop: "15px"
  }
}))

const Login = () => {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [username, setUsername] = useState('')
  const [emailSignUp, setEmailSignUp] = useState('')
  const [passwordSignUp, setPasswordSignUp] = useState('')
  
  const [modalSignUpOpen, setModalSignUpOpen] = useState(false)
  
  const [user, setUser] = useState(null) // for useEffect auth changes
  const [{ userName }, dispatch] = useStateValue()

  // listening for auth changes
  useEffect(() => {
    console.log('useEffect unsubscribe')
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        // user is logged in...
        console.log('true1 authUser.displayName', authUser.displayName)
        console.log('true1 authUser.email', authUser.email)
        setUser(authUser)
        
        //localStorage.setItem('user', JSON.stringify(authUser))

        console.log('email password', email, password)

        dispatch({
          type: actionTypes.SET_USER,
          userName: username,
          //userName: username
        })
        authUser.updateProfile({
          displayName: username,
        })

        //console.log('authUser.displayName', userName)

        if (authUser.dispplay) {
          console.log('true1 true2')
          // dont update username
        } else {
          console.log('true1 false2')
          //localStorage.setItem('user', JSON.stringify(username))
          return authUser.updateProfile({
            displayName: username,
          })
        }
      } else {
        console.log('false1')
        setUser(null)
        dispatch({
          type: actionTypes.SET_USER,
          userName: null
        })
        //localStorage.removeItem('user')
        setEmail('')
        setPassword('')
        setEmailSignUp('')
        setPasswordSignUp('')
      }
    })

    return () => {
     unsubscribe()
    }
  }, [user, userName])

  const handleLogin = e => {
    e.preventDefault()
    
    auth
      .signInWithEmailAndPassword(email, password)
      .then( authUser => {
        console.log('signInWithEmailAndPassword authUser', authUser)
        console.log('signInWithEmailAndPassword authUser.ser', authUser.user)
        //setUser(authUser.user)
        //localStorage.setItem('user', JSON.stringify(authUser.user))

        dispatch({
          type: actionTypes.SET_USER,
          userName: authUser.user.displayName
        })
        /* return authUser.user.updateProfile({
          displayName: username
        }) */
      }) 
      .catch(error => alert(error.message))
  }

  const handleSignUp = e => {
    e.preventDefault()
    
    auth
      .createUserWithEmailAndPassword(emailSignUp, passwordSignUp)
      .then( authUser => {
        console.log('handleSignUp authUser.user', authUser.user)            
        console.log('handleSignUp authUser.user.displayName', authUser.user.displayName)
        console.log('handleSignUp authUser.user.email', authUser.user.email)
        console.log('handleSignUp username ', username)    
      })
      .catch(error => alert(error.message))

      setModalSignUpOpen(false)
  }

  return (
    !userName ? (
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
                id="outlined-basic2" 
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
            
            {/* Sign in Modal */}
            <Modal 
              open={modalSignUpOpen} 
              onClose={() => setModalSignUpOpen(false)}
              className={classes.modal}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}>
              {/* <Fade in={modalSignUpOpen}> */}
                <div style={modalStyle} className={classes.paper}>
                  <form className={classes.signUpForm}>
                    <center>
                      <img
                        className="app__headerImage"
                        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                        alt=""
                      />
                    </center>

                    <div className={classes.inputs}>
                      <Input
                        id="username"
                        required
                        placeholder="Username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                      />
                      <Input
                        id="email"
                        placeholder="email"
                        type="text"
                        value={emailSignUp}
                        onChange={e => setEmailSignUp(e.target.value)}
                      />
                      <Input
                        id="password"
                        placeholder="password"
                        type="password"
                        value={passwordSignUp}
                        onChange={e => setPasswordSignUp(e.target.value)}
                      />
                    </div>
                    <div className={classes.button}>
                      <Button onClick={handleSignUp}>Sign Up</Button>
                    </div>
                  </form>
                </div>
              {/* </Fade> */}
            </Modal>

            <div className="signUp">
              <div className="signUp__title">Create an account</div>
              <button 
                className="signUp__botton"
                onClick={() => setModalSignUpOpen(true)}
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
   ) : ('')
  )
}

export default Login
