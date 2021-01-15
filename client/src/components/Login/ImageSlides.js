import React, { useState, useEffect } from 'react'
import './ImageSlides.css'

const ImageSlides = () => {
  //const [current, setCurrent] = useState(0)
  let current = 0
  
  let slides = document.getElementsByClassName("sliderImg")
  console.log('current', current)

  // slide effect
  useEffect(() => {
    const interval = setInterval(function() {
      for (var i = 0; i < slides.length; i++) {
        slides[i].style.opacity = 0;
      }
      current = (current = (current != slides.length - 1) ? current + 1 : 0)
      slides[current].style.opacity = 1;
    }, 5000);

    return () => {
      return () => clearInterval(interval)
    }
  }, [])

  return (
    <div className="main">
      <img
        src="https://www.instagram.com/static/images/homepage/home-phones.png/43cc71bb1b43.png"
        alt="phone"
      ></img>
      <div className="card-container">
        <div className="sliderContainer">
          <img className="sliderImg" src="https://www.instagram.com/static/images/homepage/screenshot1.jpg/d6bf0c928b5a.jpg" />
          <img className="sliderImg" src="https://www.instagram.com/static/images/homepage/screenshot2.jpg/6f03eb85463c.jpg" />
          <img className="sliderImg" src="https://www.instagram.com/static/images/homepage/screenshot3.jpg/f0c687aa6ec2.jpg" />
          <img className="sliderImg" src="https://www.instagram.com/static/images/homepage/screenshot4.jpg/842fe5699220.jpg" />
          <img className="sliderImg" src="https://www.instagram.com/static/images/homepage/screenshot5.jpg/0a2d3016f375.jpg" />
        </div>
      </div>
    </div>
  )
}

export default ImageSlides
