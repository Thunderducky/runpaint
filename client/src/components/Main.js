import React from 'react'
import Canvas from './Canvas'
import Palette from './Palette'
import Toolbar from './Toolbar'
import MouseTracker from './MouseTracker'
//const tools = ['dotpen', 'eraser']

const Main = props => {
  return (
    <div>
      <h1>paintaday</h1>
      <div style={{display:'flex'}}>
        <Canvas PUBSUB={props.PUBSUB} context={props.context}/>
        <Palette PUBSUB={props.PUBSUB} context={props.context}/>
      </div>
      <MouseTracker PUBSUB = {props.PUBSUB} />
      <Toolbar PUBSUB={props.PUBSUB}/>
    </div>
  )
}

export default Main
