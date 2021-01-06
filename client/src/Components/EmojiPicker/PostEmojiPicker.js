import React, { useEffect, useRef } from 'react'
import { InsertEmoticon } from '@material-ui/icons'
import './EmojiPicker.css'
import Picker from 'emoji-picker-react'

/* 
We create another special EmojiPicker for post modal
Material UI modal is not recognizing the ref attribute
*/
function PostEmojiPicker ({ onEmojiClick, toggleEmojiPicker, setToggleEmojiPicker }) {
  //const node2 = React.createRef()
  const node2 = useRef()

  // toggle emoji picker
  const handleClick = e => {
    console.log(node2)
    if (node2.current.contains(e.target)) {
      // inside click
      setToggleEmojiPicker(true)
      console.log('node2', node2)
      
      return;
    }
    
    // outside click 
    setToggleEmojiPicker(false)
  }

  useEffect(() => {
    console.log('EmojiPicker toggleemojipicker', toggleEmojiPicker)
  }, [toggleEmojiPicker])

  useEffect(() => {
    // add when mounted
    document.addEventListener("mousedown", handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [])

  let show
  toggleEmojiPicker ? show = 'inline' : show = 'none'
  
  return (
    <label ref={node2} className="custom-file-upload messageSender__option">
      <div style={{ display: 'flex', flexDirection: 'rows' }}>
        <InsertEmoticon style={{ color: 'orange' }} />
        <h3>Emoji</h3>
        <div style={{ display: show, position: 'absolute', zIndex: 100}}>
          <Picker 
            onEmojiClick={ onEmojiClick } 
          /> 
        </div>
      </div>
    </label>
  )
}

export default PostEmojiPicker
