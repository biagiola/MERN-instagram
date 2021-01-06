import React, { useState, useEffect } from 'react'
import './Feed.css'
import MessageSender from '../MessageSender/MessageSender'
import Post from '../Post/Post'
import StoryReel from '../StoryReel/StoryReel'
import axios from '../../axios'

const Feed = () => {
  const [postsData, setPostsData] = useState([]) // post comming from db
  const [currentPost, setCurrentPost] = useState([]) // post comming in realtime user interaction
  const [retrieveIdPost, setRetrieveIdPost] = useState('')

  // fetch the posts
  const syncFeed = () => {
    axios.get('posts/retrieve')
      .then( res => {
        console.log(res.data)
        //setPostsData(res.data)
        console.log(postsData)
      })
      .catch( err => console.log(err))
  }

  // delete post from the dom
  const filterPost = id => {
    console.log('feed filterPost id:', id)
    console.log('feed filterPost retrieveIdPost:', retrieveIdPost)
    console.log('filterPost currentPost', currentPost)

    // for posts that already are in the db
    setPostsData( postsData.filter( postdata => (postdata._id !== id))) 
    // for posts that is generated in realtime
    setCurrentPost( currentPost.filter( currentdata => (currentdata._id !== id))) 
  }

  useEffect(() => {
    syncFeed()
  }, [])

   useEffect(() => {
  }, [postsData])


  useEffect(() => {
  }, [currentPost])

  return (
    <div className='feed' >
      <StoryReel />
      
      <MessageSender 
        currentPost={ currentPost => setCurrentPost( old => [currentPost, ...old])} 
        retrieveIdPost={ retrieveIdPost => setRetrieveIdPost( retrieveIdPost ) }
      />
      
      {/*  newest post*/}
      {
        currentPost.map( entry => (
          <Post key={entry.timestamp}
            id={retrieveIdPost}
            filterPost={ dato => filterPost(dato)}
            profilePic={entry.avatar}
            message={entry.text}
            like={entry.like}
            timestamp={entry.timestamp}
            imgName={entry.imgName}
            username={entry.user}
            email={entry.email}
          />
        ))
      }
      
      {/* data that already exists */}
      {
        postsData.map(entry =>  
          <Post key={entry.timestamp}
            id={entry._id}
            filterPost={ dato => filterPost(dato)}
            setCurrentPost={ setCurrentPost }
            profilePic={entry.avatar}
            message={entry.text}
            like={entry.like}
            timestamp={entry.timestamp}
            imgName={entry.imgName}
            username={entry.user}
            email={entry.email}
          /> 
        )
      }
    </div>
  )
}

export default Feed
