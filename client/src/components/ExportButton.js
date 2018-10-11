import React from 'react'

const ExportButton = (props) => {
  return (
    <a style={{color:'white'}}
      download="Mastapeece.png"
      onClick={
        // export images
        event => {
          props.PUBSUB.publish(
            'canvas.request.imageData',
            { cb: data => event.target.href = data }
          )
        }
      }>
        Export
    </a>
  )
}

export default ExportButton
