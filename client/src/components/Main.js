import React from 'react'
import Canvas from './Canvas'

const Main = props =>
  (
    <div>
      <h1>Test</h1>
      <Canvas PUBSUB={props.PUBSUB} context={props.context}/>
    </div>
  )

export default Main
