import React, { useState, useEffect, useRef } from 'react'
import { Avatar,  } from '@material-ui/core'
import { useStateValue } from '../../../StateProvider'
import EmojiPicker from '../../EmojiPicker/EmojiPicker'
import IsolatedComment from './IsolatedComment'
import './PostComments.css'
import axios from '../../../axios'

const PostComments = ({ id, username, profilePic }) => {
  const [comment, setComment] = useState('') // individual comment that is sent to db
  const [usersComments, setUsersComments] = useState([]) // from the db
  const [currentComments, setCurrentComments] = useState([]) // from the input user to make realtime rendering dom
  const [{ user }, dispatch] = useStateValue()
  // emoji elements
  const [toggleEmojiPicker, setToggleEmojiPicker] = useState(false)
  const [chosenEmoji, setChosenEmoji] = useState(null)
  const node = useRef()

  // add comment to the db and dom
  const handleComments = e => {
    e.preventDefault()

    let userComment = {
      user: username,
      email: user.email,
      avatar: user.photoURL,
      text: comment,
      timestamp: new Date()
    }

    axios.post('/comments/add/' + id, { userComment })
      .then( resp => {
        console.log('then axios handlecomments')

        console.log('resp', resp.data._id)
        console.log('resp.data.length', resp.data.length)

        // comment id comming from the db
        userComment._id = resp.data._id
        
        setCurrentComments(oldComments => [...oldComments, userComment]) // this is for the dom

        setComment('')
        
      })
      .catch( err => console.log( 'error', err ) )
  }
  
  // delete a comment from the dom
  const filterCommentDOM = commentId => {
    console.log('holi commentId', commentId)
    console.log('usersComments', usersComments)
    
    // data that is already into the database
    setUsersComments(usersComments.filter( usersComment => (usersComment._id !== commentId)))
    // data generated in realtime (no refreshing the page)
    setCurrentComments(currentComments.filter( currentComment => (currentComment._id !== commentId)))
  }
  
  // get post's comments
  const fetchComments = () => {
    axios.get('comments/retrieve/' + id)
      .then( res => {
        res.data.map( usercomment => setUsersComments(prevUserComment => [...prevUserComment, usercomment]))
        console.log('res.data: ',res.data)
        console.log('map usersComments', usersComments)
      })
      .catch( err => {
        console.log('err: ', err)
      })
  }

  // handle emojis (add emojis)
  const onEmojiClick = (event, emojiObject) => {
    console.log('onEmojiClick')
    //setToggleEmojiPicer(!toggleEmojiPicker)
    setChosenEmoji(emojiObject);
    setComment( comment => comment.concat(emojiObject.emoji))
  }

  // toggle emoji picker
  const handleClick = e => {
    if (node.current.contains(e.target)) {
      // inside click
      setToggleEmojiPicker(true)
      console.log('node', node)
      
      return;
    }
    
    // outside click 
    setToggleEmojiPicker(false)
  }

  useEffect(() => {
    // add when mounted
    document.addEventListener("mousedown", handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [])

  useEffect(() => {
    fetchComments()
  }, [])

  useEffect(() => {
  }, [usersComments])

  return (
    <div className='post__comments'>
      <form onSubmit={ handleComments }>
        <Avatar src={ user.photoURL } className='post__comments__avatar'/>
        <div className='post__comments__send'>
          <input 
            type='text' 
            placeholder='Write comment' 
            value={ comment } 
            onChange={e => setComment(e.target.value)} 
          />
          <div ref={node}>
            <EmojiPicker
              toggleEmojiPicker={toggleEmojiPicker}
              onEmojiClick={onEmojiClick}
            />
          </div>
        </div>

        <div className='post__comments__emojiPicker'>
          
        </div>

        <button type='submit'>Comment</button>
      </form> 
        
      <div className='post__comments__box'>
        
        {/* Comments from db */}
        {
          usersComments.length > 0 ?
          usersComments.map(
            userComment =>
              /* we need to make every userComment in a different component to reach the real id; MenuItem always grab the last id by default */
              <IsolatedComment
                key={userComment._id} 
                postId={id}
                userComment={userComment}
                username={userComment.user}
                email={userComment.email}
                profilePic={userComment.avatar}
                filterCommentDOM={(commentId) => filterCommentDOM(commentId)}
              />
            ): ''
        }
        
        {/* Currents comments; give the sensation of realtime app */}
        {
          currentComments.length > 0 ? 
            currentComments.map( 
              current => 
              <IsolatedComment
                key={current.timestamp} 
                postId={id} 
                userComment={current}
                username={username}
                email={current.email}
                profilePic={user.photoURL}
                filterCommentDOM={(commentId) => filterCommentDOM(commentId)}
              />
              ) 
            : ''
        }
      </div>
    </div>
  )
}

export default PostComments
