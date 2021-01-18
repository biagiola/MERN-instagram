import React, { useState, useRef } from "react"
import { storage } from "../../firebase"
import "./ImageUpload.css"
import { Input, Button } from "@material-ui/core"
import axios from '../../axios'
import { actionTypes } from '../../Reducer'
import { useStateValue } from '../../StateProvider'

const ImageUpload = () => {
  const [image, setImage] = useState(null)
  const [url, setUrl] = useState(null)
  const [progress, setProgress] = useState(0)
  const [caption, setCaption] = useState('')
  const [{ userName }, dispatch] = useStateValue()
  const hiddenFileInput = useRef(null)

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image)
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // Error function ...
        console.log(error);
      },
      () => {
        // complete function ...
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then( url => {
            setUrl(url)
            
            axios.post('/posts/upload/post', {
              image: url,
              caption: caption,
              user: userName,
              comments: [],
              timestamp: Date.now()
            }).then( response => {
              console.log(response.data)
              dispatch({
                type: actionTypes.SET_NEW_POST,
                post: response.data
              })
            })

            setProgress(0)
            setCaption("")
            setImage(null)
          })
      }
    )
  }

  return (
    <div className="imageupload">

      <progress className="imageupload__progress" value={progress} max="100" />

      <Input
        placeholder="Enter a caption"
        value={caption}
        onChange={e => setCaption(e.target.value)}
        disableUnderline={true} 
        autoFocus={true}

      />
      <div className="imageupload__bottom">
        <Button className="imageupload__button" onClick={handleUpload}>
          Upload
        </Button>

        <label className="uploadPhoto " for="uploadPhoto">Select File</label>
        <input 
          type="file" 
          /* style={{display: "none"}}  */
          id="uploadPhoto" 
          onChange={handleChange} 
        />
      </div>
      
      <br />

    </div>
  );
};

export default ImageUpload
