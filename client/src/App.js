import React from 'react'
import {PUBSUB} from './modules/pubsub'
import Main from './components/Main'

import {makeKeyboardShortcuts} from './modules/keyboardShortcuts'
import {makeMasterContext} from  './contexts/masterContext'
import {makeCanvasProcesser } from  './processers/canvasProcesser'
import {makeUndoSystem} from './system/undoSystem'

// window.debugSave = (name, data) => localStorage.setItem(name, JSON.stringify(data))
// window.debugLoad = (name) => JSON.parse(localStorage.getItem(name))

class App extends React.Component {
  constructor(){
    super()
    this.myContext = makeMasterContext(PUBSUB)
    this.canvasProcesser = makeCanvasProcesser(PUBSUB, this.myContext)
    this.undoSystem = makeUndoSystem(PUBSUB)

    // need to build a better system for this, but hey :)
    // Let's try and just make the undo and redo piece here
    PUBSUB.subscribe('command.undo', () => {
      this.undoSystem.undo()
    })
    PUBSUB.subscribe('command.redo', () => {
      this.undoSystem.redo()
    })

    //DEBUG: window.PUBSUB = PUBSUB

    makeKeyboardShortcuts(PUBSUB)
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
