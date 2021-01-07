import React from 'react'
import InstagramEmbed from 'react-instagram-embed'

const EmbedInstagram = () => {
  return (
    <div>
      <InstagramEmbed
        url="https://www.instagram.com/p/B_uf9dmAGPw/"
        clientAccessToken='123|456'
        maxWidth={320}
        hideCaption={false}
        containerTagName="div"
        protocol=""
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />
    </div>
  )
}

export default EmbedInstagram
