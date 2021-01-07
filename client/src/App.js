import React from 'react'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Posts from './components/Posts/Posts'
import EmbedInstagram from './components/EmbedInstagram/EmbedInstagram'

import { db, auth } from './firebase'
import { Button, Avatar, makeStyles, Modal, Input } from '@material-ui/core'

function App() {
  return (
    <div className="app">

      <Header />

      <Posts />

      <EmbedInstagram />

      <Footer />
    </div>
  );
}

export default App


