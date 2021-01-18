import React, { useState, useEffect, useCallback } from 'react'
import axios from '../../axios'
import { useStateValue } from '../../StateProvider'
import FlipMove from 'react-flip-move'
import Post from './Post'
import './Posts.css'

const Posts = () => {
  const [posts, setPosts] = useState([]) // posts comming from db
  const [{ userName, newPosts }] = useStateValue()

  // show posts from database
  useEffect(() => {
    syncFeed() 
    return () => clearInterval(syncFeed)
  }, [])

  const syncFeed = () => {
    axios.get('posts/retrieve')
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
  }, [newPosts])

  useEffect(() => {
  }, [posts])
  
  console.log('posts are >>>', posts)
  console.log('newPosts are >>>', newPosts)

  return (
    <div>
      <div className="posts" >

        <FlipMove>
        {newPosts.length ? newPosts.map( response => (
          <Post
            user={'David'}
            key={response._id}
            postId={response._id} 
            username={response.user}
            caption={response.caption}
            imageUrl={response.image}
          />
        )) : <div></div>
        }
        </FlipMove>
        
        <FlipMove>
          {userName ? posts.map(post => (
              <Post
                user={'David'}
                key={post._id}
                postId={post._id} 
                username={post.user}
                caption={post.caption}
                imageUrl={post.image}
              />
              )) : <div></div>}
          </FlipMove>
      </div>
    </div>
  )
}

export default Posts
