import React, { useState, useEffect } from 'react'
import Pusher from 'pusher-js'
import axios from '../../axios'
import FlipMove from 'react-flip-move'
import { useStateValue } from '../../StateProvider'
import { actionTypes } from '../../Reducer'
import Post from './Post'

const Posts = () => {
  const [posts, setPosts] = useState([])
  const [{ userName }, dispatch] = useStateValue()

  // Pusher effect
  useEffect(() => {
    let pusher = new Pusher('5f367bf3f66a524e6461', {
      cluster: 'us2'
    });

    let channel = pusher.subscribe('posts');
    channel.bind('inserted', (data) => {
      fetchPosts()
    });
  }, [])

  const fetchPosts = async () => 
    await axios.get('/sync').then(response => {
      console.log(response)
      setPosts(response.data)
    })

  // show posts from firebase
  useEffect(() => {
      fetchPosts() /* db.collection("posts").orderBy("timestamp", "desc").onSnapshot((snapshot) => setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })))); */
  }, []);

  console.log('posts are >>>', posts)

  return (
    <div>
      <div className="app__posts">
        <FlipMove>
          {userName ? posts.map(post => (
            <Post
              user={userName}
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
