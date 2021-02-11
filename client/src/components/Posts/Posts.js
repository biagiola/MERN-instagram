import React, { useState, useEffect, useCallback } from 'react'
import axios from '../../axios'
//import axios from 'axios'
import { useStateValue } from '../../StateProvider'
import Post from './Post'
import './Posts.css'
import FlipMove from 'react-flip-move'

const Posts = () => {
  const [posts, setPosts] = useState([]) // posts comming from db
  const [{ userName, userEmail, newPosts }] = useStateValue()

  const syncFeed = () => {
    axios.get('/posts/retrieve/')
      .then(res => {
        console.log(res.data)
        setPosts(res.data)
        console.log('res.data', res.data)
      })
      .catch( err => console.log(err))
  }

  useEffect(() => {
    syncFeed()
    return () => clearInterval(syncFeed)
  }, [newPosts, userEmail])

  // filter post (from the dom)
  const handleFilter = (id) => {
    setPosts( posts.filter( postdata => (postdata._id !== id) ))
  }
  
  console.log('posts are >>>', posts)
  console.log('newPosts are >>>', newPosts)

  return (
    <div>
      <div className="posts">

        {newPosts.length > 0 ? newPosts.map( response => (
          <Post
            key={response._id}
            postId={response._id} 
            username={response.user}
            caption={response.caption}
            imageUrl={response.image}
            filterPost={ dato => handleFilter(dato) }
          />
          )) : ''
        }

        <FlipMove>
          {userEmail ? posts.map(post => (
            <Post
              key={post._id}
              postId={post._id} 
              username={post.user}
              caption={post.caption}
              imageUrl={post.image}
              filterPost={ dato => handleFilter(dato) }
            />
            )) : ''}
        </FlipMove>

      </div>
    </div>
  )
}

export default Posts