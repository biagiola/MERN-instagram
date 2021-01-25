import React, { useState, useEffect } from 'react'
import { Button, TextField, Input, makeStyles, Modal, Fade, Backdrop } from '@material-ui/core'
import axios from '../../axios'
import FormData from 'form-data'
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
    height: "250px",
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
  const [{ userName, userEmail }, dispatch] = useStateValue()
  const [image, setImage] = useState(null)
  
  // listening for auth changes
  /* useEffect(() => {
    console.log('useEffect unsubscribe')
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        // user is logged in...
        console.log('true1 authUser.displayName', authUser.displayName)
        setUser(authUser)
        
        localStorage.setItem('user', JSON.stringify(username))

        // dispatches for signup
        dispatch({
          type: actionTypes.SET_EMAIL,
          userEmail: authUser.email,
        })
        dispatch({
          type: actionTypes.SET_USER,
          userName: username
        })

        // firebase set displayName
        authUser.updateProfile({
          displayName: username
        })
        authUser.reload()

        console.log('authUser.displayName2', authUser.displayName)

        if (authUser.displayName) {
          console.log('true1 true2')
          // dont update username
        } else {
          console.log('true1 false2')
          //localStorage.setItem('user', JSON.stringify(username))
          authUser.updateProfile({
            displayName: username,
          })
          return authUser.reload()
        }
      } else {
        console.log('false1')
        setUser(null)
        dispatch({
          type: actionTypes.SET_USER,
          userUser: null
        })
        dispatch({
          type: actionTypes.SET_EMAIL,
          userEmail: null
        })
        localStorage.removeItem('user')
        localStorage.removeItem('email')
        setEmail('')
        setPassword('')
        setEmailSignUp('')
        setPasswordSignUp('')
      }
    })

    return () => {
     unsubscribe()
    }
  }, [user, userEmail, userName]) */

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if(authUser) {
        console.log('it has authUser')
        if(authUser.displayName) {
          console.log('it has displayName')
          
          localStorage.setItem('user', JSON.stringify(username))
          
          dispatch({
            type: actionTypes.SET_EMAIL,
            userEmail: authUser.email,
          })
          dispatch({
            type: actionTypes.SET_USER,
            userName: authUser.displayName
          })

        } else {
          console.log('it has not displayName')

          localStorage.setItem('user', JSON.stringify(username))

          dispatch({
            type: actionTypes.SET_EMAIL,
            userEmail: emailSignUp,
          })
          dispatch({
            type: actionTypes.SET_USER,
            userName: username
          })
        }
      } else {
        console.log('No auth')
      }
    })

    return () => {
      unsubscribe()
    }
  }, [user, userEmail, userName])

  const handleLogin = e => {
    e.preventDefault()
    
    auth
      .signInWithEmailAndPassword(email, password)
      .then( authUser => {
        console.log('signInWithEmailAndPassword authUser.ser', authUser.user)
        setUser(authUser.user)
      }) 
      .catch(error => alert(error.message))
  }

  const handleImage = e => {
    console.log('hangleImage called')
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSignUp = e => {
    e.preventDefault()
    
    auth
      .createUserWithEmailAndPassword(emailSignUp, passwordSignUp)
      .then( authUser => {
        console.log('handleSignUp authUser.user.displayName', authUser.user.displayName)
        console.log('handleSignUp username ', username)    

        localStorage.setItem('user', JSON.stringify(username))
        localStorage.setItem('email', JSON.stringify(emailSignUp))

        authUser.user.updateProfile({
          displayName: username
        }).then( console.log('displayName success!'))

        authUser.user.reload()

        console.log('authUser.displayName', authUser.displayName)
        
      })
      .catch(error => alert(error.message))

    /* if (image) {
      const imgForm = new FormData()
      imgForm.append('file', image, image.name)

      console.log('imgForm', imgForm)

      axios.post('user/upload/image', imgForm, {
        headers: {
          'accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-type': `multipart/form-data; boundary=${imgForm._boundary}`,
        }
      }).then( res => {
        console.log('post img res.data',res.data) */

        /* auth
          .createUserWithEmailAndPassword(emailSignUp, passwordSignUp)
          .then( authUser => {
            console.log('handleSignUp authUser.user', authUser.user)            
            console.log('handleSignUp authUser.user.displayName', authUser.user.displayName)
            console.log('handleSignUp authUser.user.email', authUser.user.email)
            console.log('handleSignUp username ', username)    

            authUser.user.updateProfile({
              displayName: username
            }).then( console.log('displayName success!')) 
          })
          .catch(error => alert(error.message)) */

   /*    })
    }
    else {
      alert('Must to select a image')
    } */
  }

  const handleLogout = () => {
    auth.signOut()
      .then(result => {
        dispatch({
          type: actionTypes.SET_EMAIL,
          userEmail: null
          
        })

        dispatch({
          type: actionTypes.SET_USER,
          userName: null
        })

        localStorage.removeItem('user')
        localStorage.removeItem('email')

      }).catch(error => alert(error.message))
  }

  return (
    !userEmail ? (
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
            <form action="" className="login__page__form" onSubmit={handleLogin}>
              <TextField 
                autoComplete="false"
                id="outlined-basic" 
                label="Email" 
                variant="outlined"
                className="login__form__email"
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <TextField 
                autoComplete="false"
                id="outlined-basic2" 
                label="Password" 
                variant="outlined"
                className="login__form__password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button 
                /* disabled={!email} */
                className="login__botton">
                  Log In
              </button>
            </form>

            <form onSubmit={handleLogout}>
              <button className="login__botton">Logout</button>
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
              <Fade in={modalSignUpOpen}>
                <div style={modalStyle} className={classes.paper}>
                  <form className={classes.signUpForm} onSubmit={handleSignUp}>
                    <center>
                      <img
                        className="app__headerImage"
                        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                        alt=""
                      />
                    </center>

                    <div className={classes.inputs}>
                      <Input
                        autoComplete="false"
                        id="username"
                        required
                        placeholder="Username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                      />
                      <Input
                        autoComplete="false"
                        id="email"
                        placeholder="email"
                        type="text"
                        value={emailSignUp}
                        onChange={e => setEmailSignUp(e.target.value)}
                      />
                      <Input
                        autoComplete="false"
                        id="password"
                        placeholder="password"
                        type="password"
                        value={passwordSignUp}
                        onChange={e => setPasswordSignUp(e.target.value)}
                      />
                      {/* image upload */}
                      <div>
                        <label className="custom-file-upload messageSender__option">
                          <h3>Photo</h3>
                          <Input 
                            type="file" 
                            onChange={handleImage} 
                            className='postModal__filehandler' 
                            label="upload"
                          />
                        </label>
                      </div>
                    </div>
                    <div className={classes.button}>
                      <Button type="submit">Sign Up</Button>
                    </div>
                  </form>
                </div>
              </Fade>
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
