import React, { useState, useEffect } from "react"
import './Header.css'
import 'semantic-ui-css/semantic.min.css'
import { auth } from '../../firebase'
import { useStateValue } from '../../StateProvider'
import { actionTypes } from '../../Reducer'
import { Button, Avatar, makeStyles, Modal, Input, IconButton, Backdrop, Fade } from "@material-ui/core"
import { FavoriteBorder, Explore, Home } from '@material-ui/icons'
import { Icon } from 'semantic-ui-react'
import FlipMove from 'react-flip-move'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    height: "380px",
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
    width: 400,
    height: 200,
    backgroundColor: theme.palette.background.paper,
    border: "0",
    borderRadius: "15px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(0, 0, 0), // button, sides, and top
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    
  },
  button: {
    padding: theme.spacing(2, 2, 2),
    color: "#262626",
    fontWeight: 500,
    borderBottom: "1px solid lightgray"
  },
  redButton: {
    padding: theme.spacing(2, 2, 2),
    color: "#e15d61",
    fontWeight: 900,
    borderBottom: "1px solid lightgray"
  }
  
}))

const Header = () => {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)
  
  const [open, setOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [openProfileInfo, setOpenProfileInfo] = useState(false)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

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
            displayName: username,
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
  }, [user])


  const handleLogin = (e) => {
    e.preventDefault()
    
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpen(false);
  }

  const handleRegister = (e) => {
    e.preventDefault();
    
    console.log('email password register', email, password)

    auth
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setRegisterOpen(false);
  };

  const handleLogout = () => {
    auth.signOut()
    
    dispatch({
      type: actionTypes.SET_USER,
      user: null
    })

    // close the modal
    setOpenProfileInfo(false)
  }

  return (
    <div>
      {/* Register modal */}
      <Modal open={registerOpen} onClose={() => setRegisterOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__login">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleRegister}>Register</Button>
          </form>
        </div>
      </Modal>

      {/* Sign in Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__login">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin}>Login</Button>
          </form>
        </div>
      </Modal>

      {/* Header */}
      <div className="app__header">
      <img
        className="app__headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt="logo"
      />
      {userName ? (
        <div className="app__headerRight">
          
          <div className="header__icons">
            <IconButton>
              <Home style={{ color: "#212112" }} />
            </IconButton>
            <IconButton>
              <FavoriteBorder style={{ color: "#212112" }}/> 
            </IconButton>
            
            <IconButton>
              <Icon name='facebook messenger' width="32px" height="32px" style={{ color: "#212112" }}/>
            </IconButton>
            
            <IconButton>
              <Explore style={{ color: "#212112" }}/>
            </IconButton>
          </div>  

          <div>{userName}</div>
          {/* Logout modal */}
          <IconButton>
            
              <Modal 
                open={openProfileInfo} 
                onClose={() => setOpenProfileInfo(false)}
                className={classes.modal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
              >
                <Fade in={openProfileInfo}>
                  <div style={modalStyle} className={classes.paper}>
                    <div className={classes.buttons}>
                      <Button onClick={handleLogout} className={classes.redButton }>Logout</Button>
                      <Button className={classes.redButton }>Report</Button>
                      <Button className={classes.button }>Go to post</Button>
                      <Button className={classes.button }>Share to...</Button>
                      <Button className={classes.button }>Copy Link</Button>
                      <Button className={classes.button }>Embed</Button>
                      <Button onClick={() => setOpenProfileInfo(false)} className={classes.button}>Cancel</Button>
                    </div>
                  </div>
                </Fade>
              </Modal>
            
            <Avatar
              onClick={() => setOpenProfileInfo(true)}
              className="app__headerAvatar"
              alt={userName}
              src="/static/images/avatar/1.jpg"
            />
          </IconButton>
        </div>
      ) : (
        <form className="app__loginHome">
          <Button onClick={() => setOpen(true)}>Login</Button>
          <Button onClick={() => setRegisterOpen(true)}>Sign Up</Button>
        </form>
      )}
    </div>
  </div>
  )
}

export default Header
