import React from 'react'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Posts from './components/Posts/Posts'
import EmbedInstagram from './components/EmbedInstagram/EmbedInstagram'
import { useStateValue } from './StateProvider'

function App() {

  const [{user}] = useStateValue()

  return (
    <div className="app">
      {
        user  ? 
          <div>
            <Header />
            
            <Posts />
            
            <EmbedInstagram />

            <Footer />
          </div>
        :
          <div>Welcome to Instagram</div>
      }
    </div>
  );
}

export default App


