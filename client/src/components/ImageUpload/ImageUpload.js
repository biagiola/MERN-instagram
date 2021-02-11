import React, { useState, useRef } from 'react'
import { storage } from '../../firebase'
import { Input, Button } from '@material-ui/core'
import { InsertEmoticon }from '@material-ui/icons'
import axios from '../../axios'
import EmojiPicker from 'emoji-picker-react'
import { actionTypes } from '../../Reducer'
import { useStateValue } from '../../StateProvider'
import './ImageUpload.css'

const ImageUpload = () => {
  const [image, setImage] = useState(null)
  const [url, setUrl] = useState(null)
  const [progress, setProgress] = useState(0)
  const [caption, setCaption] = useState('')
  const [{ userName }, dispatch] = useStateValue()
  const [emojiPicker, setEmojiPicker] = useState(false)
  const hiddenFileInput = useRef(null)

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image)
    uploadTask.on(
      'state_changed',
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
          .ref('images')
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
            setCaption('')
            setImage(null)
          })
      }
    )
  }

  const addEmoji = (event, emojiObject) => {
    setCaption( emojiAdded => emojiAdded.concat(emojiObject.emoji))
  }

  const handleUploadErrorMassage = () => {
    alert('File was not selected')
  }

  return (
    <div className='imageupload'>
      <progress className='imageupload__progress' value={ progress } max='100' />
      
      <div className='writeMessage'>
        <div className='inputImage'>
          <Input
            placeholder='Enter a caption'
            value={ caption }
            onChange={ e => setCaption(e.target.value) }
            disableUnderline={ true } 
            autoFocus={ true }
            style={{ padding: '0 10px' }}
          />
        </div>
        <div onClick={ () => setEmojiPicker(!emojiPicker) }>
          <InsertEmoticon className='openEmojiPicker'/>
        </div>
      </div>
      

        <div className='emojiPicker' style={{ display: emojiPicker ? '' : 'none' }}>
          <EmojiPicker 
            onEmojiClick={ addEmoji } 
            groupVisibility={{
              flags: false,
              symbols: false
            }}
            disableSearchBar={ true } /> 
        </div>
      

      <div className='imageupload__bottom'>
        {
          image ?
          <Button 
            className='imageupload__button__selected' 
            onClick={ handleUpload }>
            Upload
          </Button>
          :
          <Button 
            className='imageupload__button' 
            onClick={ handleUploadErrorMassage }>
            Upload
          </Button>
        }

        <label className='uploadPhoto ' htmlFor='uploadPhoto'>Select File</label>
        <input 
          type='file'
          /* style={{display: "none"}}  */
          id='uploadPhoto' 
          onChange={ handleChange } 
        />
      </div>
        
      <br/>

    
    </div>
  )
}

export default ImageUpload
