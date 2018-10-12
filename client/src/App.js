import React from 'react'
import {PUBSUB} from './modules/pubsub'
import Main from './components/Main'

import {makeMasterContext} from  './contexts/masterContext'
import {makeCanvasProcesser } from  './processers/canvasProcesser'
class App extends React.Component {
  constructor(){
    super()
    this.myContext = makeMasterContext(PUBSUB)
    this.canvasProcesser = makeCanvasProcesser(PUBSUB, this.myContext)

    // FOR DEBUG
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
