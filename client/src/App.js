import React from 'react'
import {PUBSUB} from './modules/pubsub'
import Main from './components/Main'

import {makeMasterContext} from  './contexts/masterContext'
import {makeCanvasProcesser } from  './processers/canvasProcesser'
class App extends React.Component {
  constructor(){
    super()
    // Let's set up our initial context
    // with a canvas provider
    // with something like width and height already
    // setup
    // can't be named context because react uses that
    this.myContext = makeMasterContext(PUBSUB)
    this.canvasProcesser = makeCanvasProcesser(PUBSUB, this.myContext)
    window.PUBSUB = PUBSUB // makes it easier to experiment with
    window.myContext = this.myContext
    window.canvasProcesser = this.canvasProcesser
  }
  render(){
    return (
      <div>
        <Main PUBSUB={PUBSUB} context={this.myContext}/>
      </div>
    )
  }
}

export default App
