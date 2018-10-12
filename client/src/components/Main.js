import React from 'react'
import Canvas from './Canvas'
import Palette from './Palette'
//const tools = ['dotpen', 'eraser']

const Main = props => {
  const setToolWrapper = tool => {
    const clickHandler = () => {
      props.PUBSUB.publish('context.canvas.set.tool', { tool })
    }
    return clickHandler
  }

  return (
    <div>
      <h1>Test</h1>
      <div style={{display:'flex'}}>
        <Canvas PUBSUB={props.PUBSUB} context={props.context}/>
        <Palette PUBSUB={props.PUBSUB}/>
      </div>
      <div style={{display:'flex'}}>
        <div>Active Tool Goes Here</div>
        <div onClick={setToolWrapper('dotpen')}>Dotpen</div>
        <div onClick={setToolWrapper('eraser')}>Eraser</div>
      </div>
    </div>
  )
}

export default Main
