import React, { useState, useEffect } from 'react'
import { Avatar, Input } from '@material-ui/core'
import { Button, Menu, MenuItem, IconButton } from '@material-ui/core'
import { AccountCircle, ThumbUp, ChatBubbleOutline, NearMe, ExpandMoreOutlined, Edit, DeleteOutline, MoreHoriz } from '@material-ui/icons'
import axios from '../../axios'
import PostComments from './PostComments/PostComments'
import './Post.css'
import '../MessageSender/MessageSender.css'
import { useStateValue } from '../../StateProvider'

const Post = ({ id, filterPost, profilePic, imgName, username, email, timestamp, message, like }) => {
  const [anchorEl, setAnchorEl] = useState(null) // elements of the modal
  const [likeCliked, setLikeCliked] = useState(like)
  const [activeComment, setActiveComment] = useState(false) /* toogle the post comment's box */

  const [comment, setComment] = useState('')
  const [openEdit, setOpenEdit] = useState(false) // open edit input
  const [{ user }, dispatch] = useStateValue()

  //const [currentPost, setCurrentPost] = useState([]) // post comming in realtime user interaction

  // modal opens
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }
  // modal close
  const handleClose = () => {
    setAnchorEl(null);
  }

  // delete post
  const handleDelete = () => {
    console.log('Post.js handleDelete retrievePost,id', id)
    
    if( user.email === email ) {
      axios.delete( 'posts/delete/' + id )
        .then( res => {
          console.log( res.data )
          if(res.data.value == true) {
            console.log('res value', res.data.value)
            // we send the deleted comment id to filtered from the dom
            console.log('Post.js handleDelete res.data.id', res.data.id)
            filterPost(res.data.id)
          }
        })
        .catch( err => console.log( 'error', err ) )
    } else {
      alert('Unauthorized!')
    } 
      // close the card options
      setAnchorEl(null);
  }

  // update post
  const handleUpdate = e => {
    e.preventDefault()

    console.log('handleUpdate')
    
    let postUpdate = {
      user: username,
      email: email,
      avatar: user.photoURL,
      text: comment,
      timestamp: new Date()
    }
    
    /* axios.post( '/update/' + id + '/', { postUpdate } )
      .then( res => {
        console.log( 'handleUpdate comment',res.data )
      } )
      .catch( err => console.log( 'error', err ) ) 
       */
      // close modal
      setAnchorEl(null)

      // show the comment again
      setOpenEdit(!openEdit)
  }

  // like post
  const handleLike = () => {
    console.log('handlelike', id)
    setLikeCliked(!likeCliked)
    const postData = {
      user: username,
      imgName: imgName,
      text: message,
      avatar: profilePic,
      like: !like,
      timestamp: timestamp
    }
    console.log('postData', postData)
    axios.post('/update/' + id, postData)
      .then(res => console.log(res.data))
  }

  return (
    <div className='post'>
      <div className="post__top">
        {/* main header */}
        <div className="post__top__left">
          <Avatar src={ profilePic } className='post__avatar' />
          <div className="post__topInfo">
          <h3>{ username }</h3>
            <p>{new Date(parseInt(timestamp)).toUTCString()}</p>
          </div>
        </div>
        
        {/* Options section */}
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
          <MoreHoriz className="post__top__right"/>
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <div onClick={handleDelete}>
            <MenuItem>
              <DeleteOutline/>
              <div className='post__Menu__options'>Delete</div>
            </MenuItem>
          </div>

          <div onClick={setOpenEdit(!openEdit)}>
            <MenuItem >
              <Edit />
              <div className='post__Menu__options'>Edit</div>
            </MenuItem>
          </div>
          
        </Menu>
      </div>
      
      {/* post message */}
      <div className="post__bottom">
        <p>{message}</p>
      </div>

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

      {
        imgName ? (
          <div className="post__image">
            <img src={`http://localhost:9000/posts/retrieve/image/single?name=${imgName}`} />
          </div>
        ) : (console.log('DEBUG >>> no image here'))
      }
      
      <div className="post__options">
        <div className="post__option" 
          onClick={handleLike} 
          className={ likeCliked ? "" : "post__liked"}>
          <ThumbUp />
          <p>Like</p>
        </div>
        <div className="post__option" onClick={() => setActiveComment(!activeComment)}>
          <ChatBubbleOutline />
          <p>Comment</p>
        </div>
        <div className="post__option">
          <NearMe />
          <p>Share</p>
        </div>
        <div className="post__option">
          <AccountCircle />
          <ExpandMoreOutlined />
        </div>
      </div>
      
      {/* Comment box */}
      {activeComment ? 
        <PostComments
          id={id}
          username={username}
          profilePic={profilePic}
        />: ''}
      
    </div>
  )
}

export default Post
