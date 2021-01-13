import React, { useState, useEffect, forwardRef } from 'react'
import './Post.css'
import axios from '../../axios'
import { Avatar } from '@material-ui/core'
import { MoreHoriz, Edit, DeleteOutline } from '@material-ui/icons'
import { Button, IconButton, Menu, MenuItem } from '@material-ui/core'
import { db } from '../../firebase'
import { useStateValue } from '../../StateProvider'

/* 
  functional components that are styled still be class base component
  and FlipMove component needs to work only with functional components
  in order that, we use forwardRef
*/

const Post = forwardRef(
  ({ user, username, postId, imageUrl, caption }, ref) => {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState("")
  const [like, setLike] = useState(false)
  const [save, setSave] = useState(false)

  const [{ userName }] = useStateValue()
  const [anchorEl, setAnchorEl] = useState(null) // elements of the modal

  // modal opens
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  // modal close
  const handleClose = () => {
    setAnchorEl(null);
  }

  useEffect(() => {
    syncFeed()
  }, [])

  /* fetch comments */
  const syncFeed = () => {
    if (postId) {
      db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map(doc => doc.data()));
        })
    }

    console.log('comments',comments)
  }

  // add comments to the post
  const postComment = e => {
    e.preventDefault()

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: userName,
    })
    setComment("")
  }

  // delete comments
  const handleDelete = e => {
    e.preventDefault()

    axios.delete( 'posts/delete/' + postId )
      .then( res => {
        console.log( res.data )
        if(res.data.value === true) {
          console.log('res value', res.data.value)
          // we send the deleted comment id to filtered from the dom
          console.log('Post.js handleDelete res.data.id', res.data.id)
          //filterPost(res.data.id)
        }
      })
      .catch( err => console.log( 'error', err ) )

    /* db.collection("posts").doc(postId).collection("comments").doc.()add({
      text: comment,
      username: userName,
    }) */
  }

  const handleLikeButton = () => {
    setLike(!like)
  }

  const handleSaveButton = () => {
    setSave(!save)
  }

  return (
    <div className="post" ref={ref}>
      
      {/* Post's Header */}
      <div className="post__header">
        <div className="post__header__title__left">
          <Avatar
            className="post__avatar"
            alt={username}
            src="/static/images/avatar/1.jpg"
          />
          <h3 className="post__header__name">{username}</h3>
        </div>
        <div className="post__header__title__right">
          <IconButton className="post__options" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
            <MoreHoriz />
          </IconButton>
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
          </Menu>
        </div>
      </div>

      {/* Post's Image */}
      <img className="post__image" src={imageUrl} alt="post" />
      <div className="post__icons">
        <div className="post__icons__left">
          <div className="post__icon ">
            { 
              like ?    
                <svg className='animated' onClick={handleLikeButton} aria-label="Ya no me gusta" class="_8-yf5 " fill="#e15d61" height="24" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
              :
                <svg className='' onClick={handleLikeButton} aria-label="Me gusta" class="_8-yf5 " fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg> 
            }
          </div>
          <div className="post__icon">
            <svg aria-label="Comment" fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path clipRule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z" fillRule="evenodd"></path></svg>
          </div>
          <div className="post__icon">
            <svg aria-label="Share Post" fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"></path></svg>  
          </div>
        </div>
        <div className="post__icons__right">
          <div className="post__icon">
            {
              save ?
                <svg className='animated' onClick={handleSaveButton} aria-label="Remove" fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 28.9 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1z"></path></svg>
              :
              <svg className='' onClick={handleSaveButton} aria-label="Save"  fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z"></path></svg>
            }
          </div>
        </div>
      </div>

      <h4 className="post__text">
        {username} <span className="post__caption">{caption}</span>
      </h4>

      {/* Comments */}
      <div className="post__comments">
        {comments.map(comment => (
          <div className="post__comment" key={Math.floor()}>
            <p>
              <b>{comment.username}</b> {comment.text}
            </p>
            <div className="comment__like">
              <div className="comment__icon">
                <svg aria-label="Like" fill="#262626" height="12" viewBox="0 0 48 48" width="12"><path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New comment form */}
      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!comment}
            className="post__button"
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  )
}
)

export default Post

 
