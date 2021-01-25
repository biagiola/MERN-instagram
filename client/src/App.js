import React, { useEffect } from 'react'
import './App.css'
import Login from './components/Login/Login'
import Header from './components/Header/Header'
import ImageUpload from './components/ImageUpload/ImageUpload'
import Posts from './components/Posts/Posts'
import EmbedInstagram from './components/EmbedInstagram/EmbedInstagram'
import { useStateValue } from './StateProvider'

function App() {
  const [{ userName, userEmail }] = useStateValue()

  console.log('app userName', userName)

  return (
    <div className="app">
      {
        userEmail ? (
          <div>
            <Header />
            <ImageUpload />
            <Posts />
            {/* <EmbedInstagram /> */}
          </div> 
        ):(
          <Login/>
        )
      }
    </div>
  )
}

export default App


