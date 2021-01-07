import React from 'react'
import ImageUpload from './ImageUpload'
import { useStateValue } from '../../StateProvider'
import { actionTypes } from '../../Reducer'

const Footer = () => {
  const [{ userName }, dispatch] = useStateValue()

  return (
    <div>
      {/* Upload footer */}
      {userName  ? (
        <div className="app__upload">
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
