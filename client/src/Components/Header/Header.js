import React, { useState } from 'react'
import { Search, Home, Flag, SubscriptionsOutlined, StorefrontOutlined, SupervisedUserCircle, Add, Forum, NotificationsActive, ExitToApp, ExpandMore } from '@material-ui/icons'
import { Avatar, IconButton, Menu, MenuItem } from '@material-ui/core'
import { useStateValue } from '../../StateProvider'
import { auth, provider } from '../../firebase'
import { actionTypes } from '../../Reducer'

import './Header.css'

const Header = () => {
  const [{ user }, dispatch] = useStateValue()
  const [anchorEl, setAnchorEl] = useState(null) 

  // modal opens
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  }
  // modal close
  const handleClose = () => {
    setAnchorEl(null);
  }

  const signOut = () => {
    console.log('signOut')
    auth.signOut()
      .then(result => {
        console.log('user logout', result)

        dispatch({
          type: actionTypes.SET_USER,
          user: null
        })

      }).catch(error => alert(error.message))
  }

  return (
    <div className='header'>
      <div className="header__left">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png" alt="Facebook logo" />
      </div>

      <div className="header__input">
        <Search />
        <input placeholder='Search Facebook' type="text" />
      </div>

      <div className="header__center">
        <div className="header__option header__option--active">
          <Home fontSize='large' />
        </div>
        <div className="header__option">
          <Flag fontSize='large' />
        </div>
        <div className="header__option">
          <SubscriptionsOutlined fontSize='large' />
        </div>
        <div className="header__option">
          <StorefrontOutlined fontSize='large' />
        </div>
        <div className="header__option">
          <SupervisedUserCircle fontSize='large' />
        </div>
      </div>

      <div className="header__right">
        <div className="header__info">
          <Avatar src={ user.photoURL } />
          <h4>{ user.displayName }</h4>
        </div>
        <div className="header__right__options">
          <IconButton>
            <Add />
          </IconButton>

          <IconButton>
            <Forum />
          </IconButton>

          <IconButton>
            <NotificationsActive />
          </IconButton>

          <IconButton aria-controls="header-modal" aria-haspopup="true" onClick={handleClick}>
            <ExpandMore />
          </IconButton>

          {/* logout modal */}
          <Menu
            id="header-modal"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={signOut}>
              <ExitToApp />
              <div className='post__Menu__options'>Log out</div>
            </MenuItem>
            
          </Menu>
        </div>
      </div>
    </div>
  )
}

export default Header
