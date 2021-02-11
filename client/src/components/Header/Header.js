import React, { useState, useEffect } from 'react'
import './Header.css'
import { auth } from '../../firebase'
import { useStateValue } from '../../StateProvider'
import { actionTypes } from '../../Reducer'
import { Button, Avatar, makeStyles, Modal, Input, IconButton, Backdrop, Fade } from '@material-ui/core'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    height: '380px',
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    
  },
  button: {
    padding: theme.spacing(2, 2, 2),
    color: '#262626',
    fontWeight: 500,
    borderBottom: '1px solid lightgra',
  },
  redButton: {
    padding: theme.spacing(2, 2, 2),
    color: '#e15d61',
    fontWeight: 900,
    borderBottom: '1px solid lightgray'
  }
  
}))

const Header = () => {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)
  
  const [openProfileInfo, setOpenProfileInfo] = useState(false)

  const [username, setUsername] = useState('')

  const [user, setUser] = useState(null)
  const [{ userName, userEmail }, dispatch] = useStateValue()

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
        dispatch({
          type: actionTypes.SET_EMAIL,
          userEmail: null
        })
        /* dispatch({
          type: actionTypes.SET_NEW_POST,
          newPosts: []
        }) */

        localStorage.removeItem('user')
        localStorage.removeItem('email')

      }).catch(error => alert(error.message))
  }

  return (
    <div>
      {/* Header */}
      <div className="app__header">
      <img
        className="app__headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt="logo"
      />
      {userEmail ? (
        <div className="app__headerRight">
          
          <div className="header__icons">
            <IconButton>
                <svg  aria-label="Home" className="_8-yf5 " fill="#212121" width="20" height="20" viewBox="0 0 48 48"><path d="M45.5 48H30.1c-.8 0-1.5-.7-1.5-1.5V34.2c0-2.6-2.1-4.6-4.6-4.6s-4.6 2.1-4.6 4.6v12.3c0 .8-.7 1.5-1.5 1.5H2.5c-.8 0-1.5-.7-1.5-1.5V23c0-.4.2-.8.4-1.1L22.9.4c.6-.6 1.6-.6 2.1 0l21.5 21.5c.3.3.4.7.4 1.1v23.5c.1.8-.6 1.5-1.4 1.5z"></path></svg>
            </IconButton>
            <IconButton>
            <svg aria-label="Activity Feed" className="_8-yf5 " fill="#212121" width="20" height="20" viewBox="0 0 48 48"><path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
            </IconButton>
            
            <IconButton>
              <svg aria-label="Messenger" className="_8-yf5 " fill="#212121" width="20" height="20" viewBox="0 0 48 48"><path d="M36.2 16.7L29 22.2c-.5.4-1.2.4-1.7 0l-5.4-4c-1.6-1.2-3.9-.8-5 .9l-6.8 10.7c-.7 1 .6 2.2 1.6 1.5l7.3-5.5c.5-.4 1.2-.4 1.7 0l5.4 4c1.6 1.2 3.9.8 5-.9l6.8-10.7c.6-1.1-.7-2.2-1.7-1.5zM24 1C11 1 1 10.5 1 23.3 1 30 3.7 35.8 8.2 39.8c.4.3.6.8.6 1.3l.2 4.1c0 1 .9 1.8 1.8 1.8.2 0 .5 0 .7-.2l4.6-2c.2-.1.5-.2.7-.2.2 0 .3 0 .5.1 2.1.6 4.3.9 6.7.9 13 0 23-9.5 23-22.3S37 1 24 1zm0 41.6c-2 0-4-.3-5.9-.8-.4-.1-.8-.2-1.3-.2-.7 0-1.3.1-2 .4l-3 1.3V41c0-1.3-.6-2.5-1.6-3.4C6.2 34 4 28.9 4 23.3 4 12.3 12.6 4 24 4s20 8.3 20 19.3-8.6 19.3-20 19.3z"></path></svg><div className="KdEwV"><div className="J_0ip  Vpz-1  TKi86 "></div></div>
            </IconButton>
            
            <IconButton>
            <svg aria-label="Find People" className="_8-yf5 " fill="#212121" width="20" height="20" viewBox="0 0 48 48"><path clipRule="evenodd" d="M24 0C10.8 0 0 10.8 0 24s10.8 24 24 24 24-10.8 24-24S37.2 0 24 0zm0 45C12.4 45 3 35.6 3 24S12.4 3 24 3s21 9.4 21 21-9.4 21-21 21zm10.2-33.2l-14.8 7c-.3.1-.6.4-.7.7l-7 14.8c-.3.6-.2 1.3.3 1.7.3.3.7.4 1.1.4.2 0 .4 0 .6-.1l14.8-7c.3-.1.6-.4.7-.7l7-14.8c.3-.6.2-1.3-.3-1.7-.4-.5-1.1-.6-1.7-.3zm-7.4 15l-5.5-5.5 10.5-5-5 10.5z" fillRule="evenodd"></path></svg>
            </IconButton>
          </div>  

          <div>{userName}</div>
          {/* Logout modal */}
            
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
                  <Button className={classes.redButton }>Report</Button>
                  <Button className={classes.button }>Go to post</Button>
                  <Button className={classes.button }>Share to...</Button>
                  <Button className={classes.button }>Copy Link</Button>
                  <Button className={classes.button }>Embed</Button>
                  <Button onClick={() => setOpenProfileInfo(false)} className={classes.button}>Cancel</Button>
                  <Button onClick={handleLogout} className={classes.redButton }>Logout</Button>
                </div>
              </div>
            </Fade>
          </Modal>
          
          <IconButton
            onClick={() => setOpenProfileInfo(true)}>  
            <Avatar
              className="app__headerAvatar"
              alt={userName}
              /* src="/static/images/avatar/1.jpg" */
            />
          </IconButton>
        </div>
      ) : (
        <form className="app__loginHome">
          <Button /* onClick={() => setOpen(true)} */>Login</Button>
          <Button /* onClick={() => setRegisterOpen(true)} */>Sign Up</Button>
        </form>
      )}
    </div>
  </div>
  )
}

export default Header
