import React, { useEffect } from 'react'
import { EmojiEmotions } from '@material-ui/icons'
import './EmojiPicker.css'
import Picker from 'emoji-picker-react'

function EmojiPicker ({ onEmojiClick, toggleEmojiPicker }) {
  
  
  useEffect(() => {
    console.log('EmojiPicker toggleEmojiPicker', toggleEmojiPicker)
  }, [toggleEmojiPicker])

  let show
  toggleEmojiPicker ? show = 'inline' : show = 'none'

  return (
    <div>
      <EmojiEmotions/>
        <div style={{ display: show, position: 'absolute', zIndex: 100}}>
          <Picker 
            onEmojiClick={ onEmojiClick } 
          /> 
        </div>
    </div>
  )
}

export default EmojiPicker
