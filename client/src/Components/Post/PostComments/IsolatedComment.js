import React, { useState, useEffect } from 'react'
import { Menu, makeStyles, MenuItem, IconButton, Avatar } from '@material-ui/core'
import { MoreHoriz, DeleteOutline, Edit, ExitToApp,  } from '@material-ui/icons'
import axios from '../../../axios'
import { useStateValue } from '../../../StateProvider'

const IsolatedComment = ({ postId, userComment, profilePic, username, email, filterCommentDOM }) => {
  const [{ user }, dispatch] = useStateValue()
  const [anchorEl, setAnchorEl] = useState(null) 
  const [openEdit, setOpenEdit] = useState(false)
  const [comment, setComment] = useState(userComment.text)
  
  const handleDelete = commentId => {
    if ( user.email === email ) {
    axios.delete( '/comments/delete/' + postId + '/' + commentId + '/' )
      .then( res => {
        filterCommentDOM(commentId)
      } )
      .catch( err => console.log( 'error', err ) ) 
    } else {
      alert('Unauthorized!!')
    }  

    // close the card options
    setAnchorEl(null);
  }

  const handleEdit = e => {
    e.preventDefault()
    setAnchorEl(null)
    
    // open edit box
    setOpenEdit(!openEdit)
  }

  const handleUpdate = e => {
    e.preventDefault()
    
    let userCommentUpdated = {
      user: username,
      email: email,
      avatar: user.photoURL,
      text: comment,
      timestamp: new Date()
    }
    
    axios.post( '/comments/update/' + postId + '/' + userComment._id + '/', { userCommentUpdated } )
      .then( res => {
        console.log( 'handleUpdate comment',res.data )
      } )
      .catch( err => console.log( 'error', err ) ) 
      
      // close modal
      setAnchorEl(null)

      // show the comment again
      setOpenEdit(!openEdit)
  }

  // modal opens
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  }
  // modal close
  const handleClose = () => {
    setAnchorEl(null);
  }

  useEffect(() => {}, [])
  
  return (
    <div>
      <div key={userComment.id} className='post__comment'>
        
        {/* Show the actual comment text */}
        { openEdit ?
          '' : 
          <div>
            <Avatar src={ profilePic }/>
            <p className='post__comment__text'>{comment}</p> 
          </div>
        }

        {/* Open the edit input to update  */}
        {
          openEdit ?
          <form onSubmit={handleUpdate}>
            <input 
              type='text' 
              placeholder='write here'
              className='post__comment__text'
              value={comment == null ? 'write it...' : comment } 
              onChange={e => setComment(e.target.value)} 
            /> 
            <button type='submit'>Comment</button>
          </form>: ''
        }

        {/* Open the modal */}
        <IconButton aria-controls="post-comment-modal" aria-haspopup="true" onClick={handleClick}>
          <MoreHoriz/>
        </IconButton>
        
        <Menu
          id="post-comment-modal"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleDelete(userComment._id)}>
            <DeleteOutline />
            <div className='post__Menu__options'>Delete</div>
          </MenuItem>
          
          <MenuItem onClick={handleEdit}>
            <Edit />
            <div className='post__Menu__options'>Edit</div>
          </MenuItem>
          
        </Menu>
      </div>
    </div>
  )
}

export default IsolatedComment
