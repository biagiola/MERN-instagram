import React from 'react'
import ImageUpload from './ImageUpload'
import { useStateValue } from '../../StateProvider'
import './Footer.css'

const Footer = () => {
  const [{ userName }] = useStateValue()

  return (
    <div>
      {/* Upload footer */}
      {userName  ? (
        <div className="footer">
          <ImageUpload username={userName} />
        </div>
      ) : (
        <center>
          <h3>Login to upload</h3>
        </center>
      )}
    </div>
  )
}

export default Footer
