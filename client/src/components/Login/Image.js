import React, { useState, useEffect } from 'react'

const Image = ({img}) => {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if(counter < 4) {
        setCounter(counter+1)
      } else {
        setCounter(0)
      }
    }, 5000)

    return () => clearInterval(interval)

  }, [counter])

  return (
    <div>
      <img 
        className="card" 
        src={`https://www.instagram.com/static/images/homepage/screenshot${(img[counter].index)+1}.jpg/${img[counter].value}.jpg`} 
      />
      
    </div>
  )
}

export default Image

