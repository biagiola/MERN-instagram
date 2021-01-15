import React, { useState, useEffect } from 'react'
import './ImageSlides.css'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Image from './Image'

const ImageSlides = () => {
  const [img, setImg] = useState([
    {value :'d6bf0c928b5a', index: 0},
    {value: '6f03eb85463c', index: 1}, 
    {value: 'f0c687aa6ec2', index: 2}, 
    {value: '842fe5699220', index: 3}, 
    {value: '0a2d3016f375', index: 4}])

  return (
    <div className="main">
      <img
        src="https://www.instagram.com/static/images/homepage/home-phones.png/43cc71bb1b43.png"
        alt="phone"
      ></img>
      <div className="card-container">
        <Image img={img} />
      </div>
    </div>
  )
}

export default ImageSlides
