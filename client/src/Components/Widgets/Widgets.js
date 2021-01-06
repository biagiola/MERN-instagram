import React from 'react'

const Widgets = () => {
  return (
    <div style={{ backgroundColor: '#F0F2F5' }}>
      <iframe 
        src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Foktanacorp&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=false&hide_cover=false&show_facepile=true&appId" 
        width="340" 
        height="800" 
        style={{border:"none", overflow:"hidden"}} 
        scrolling="no" 
        frameBorder="0" 
        allowtransparency="true" 
        allow="encrypted-media">
      </iframe>
    </div>
  )
}

export default Widgets
