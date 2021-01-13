import React, { useState, useEffect } from 'react'
import axios from '../../axios'
import { useStateValue } from '../../StateProvider'
import FlipMove from 'react-flip-move'
import Post from './Post'
import './Posts.css'

const Posts = () => {
  const [posts, setPosts] = useState([]) // posts comming from db
  const [{ userName }] = useStateValue()

  // show posts from firebase
  useEffect(() => {
    syncFeed() 
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
  }, [])

  useEffect(() => {
  }, [posts])
  
  console.log('posts are >>>', posts)

  return (
    <div>
      <div className="posts">
        
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
