import React from 'react'
import {PUBSUB} from './modules/pubsub'
import Main from './components/Main'

import {makeKeyboardShortcuts} from './modules/keyboardShortcuts'
import {makeMasterContext} from  './contexts/masterContext'
import {makeCanvasProcesser } from  './processers/canvasProcesser'
import {makeUndoSystem2} from './system/undoSystem2'

window.debugSave = (name, data) => localStorage.setItem(name, JSON.stringify(data))
window.debugLoad = (name) => JSON.parse(localStorage.getItem(name))

class App extends React.Component {
  constructor(){
    super()
    this.myContext = makeMasterContext(PUBSUB)
    this.canvasProcesser = makeCanvasProcesser(PUBSUB, this.myContext)

    // this.commandRecorder = makePubsubRecorder(PUBSUB, [
    //   'command.dotpen',
    //   'command.clear',
    //   'command.smartFill'
    // ]).listen();

    // this shouldn't need anything else since it's just a repeat
    this.undoSystem = makeUndoSystem2(PUBSUB)

    window.us = this.undoSystem;

    // need to build a better system for this, but hey :)
    // Let's try and just make the undo and redo piece here
    PUBSUB.subscribe("command.undo", (msg, topic) => {
      this.undoSystem.undo();
    })
    PUBSUB.subscribe("command.redo", (msg, topic) => {
      this.undoSystem.redo();
    })

    window.PUBSUB = PUBSUB // makes it easier to experiment with
    window.myContext = this.myContext
    window.commandRecorder = this.commandRecorder;
    window.canvasProcesser = this.canvasProcesser

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
