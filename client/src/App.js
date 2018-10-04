import React, { Component } from 'react'
import Swatch from './components/Swatch'
import Canvas from './components/Canvas'
import SWATCHES from './_data/swatches'
import colorHelper from './modules/colorHelper'
import {PUBSUB} from './modules/pubsub'
import {makeUndoSystem}  from './system/undoSystem'
const isDark = color => {
  if(color[0] === '#'){
    color = color.slice(1)
  }
  return colorHelper.isDark(color)
}
const rect = (x,y,width,height) => {
  return {
    x,y,width,height
  }
}
const sameRect = (a,b) => {
  return a.x === b.x && a.y === b.y
    && a.width === b.width
    && a.height === b.height
}

class App extends Component {
  constructor(){
    super()
    this.state = {
      canvasMouseDown: false,
      eraserActive: false,
      activeSwatch: SWATCHES[0],
      swatches: SWATCHES
    }

    const clearCanvas = () => {
      PUBSUB.publish('canvas.renderer.clearRect', {rect: rect(0,0,640,640)})
    }
    const undoableTopics = ['canvas.renderer.fillRect', 'canvas.renderer.clearRect']
    const filter = (message, lastMessage) => {
      if(lastMessage === false){
        return true
      }

      // if they are different topics
      if(message.topic !== lastMessage.topic){
        return true
      }

      // So we are guaranteed to be the same topic
      const same = !sameRect(message.msg.rect,lastMessage.msg.rect)

      return same
    }
    this.undoSystem = makeUndoSystem(PUBSUB, undoableTopics, clearCanvas, filter)
    document.onkeydown = (event) => {
      if(event.key === 'z'){
        this.undoSystem.undo()
      }
      if(event.key === 'x'){
        this.undoSystem.redo()
      }
    }
  }
  onColorClick = swatch => {
    this.setState({activeSwatch: swatch, eraserActive: false})
  }
  onEraserClick = () =>{
    this.setState({eraserActive: true})
  }
  componentDidMount(){
    // Let's set up our undo system her
  }

  render() {
    const { activeSwatch } = this.state
    return (
      <div>
        <div className="spreadRow">

          <div> {/* main */}
            <h1 className="terminal">paint.exe</h1>
            <Canvas
              ref={c => {this.canvas = c} }
              zoom={20}
              color={this.state.activeSwatch.color}
              eraserActive={this.state.eraserActive}
              width={32}
              height={32}
              undoSystem={this.undoSystem}
            />
            <div className="spreadRow"></div>
          </div>
          <div> {/* sidebar TODO: return to component */}
            <div>Active:</div>
            {!this.state.eraserActive
              ? ( // TODO: do this more elegantly
                <Swatch color={activeSwatch.color}>
                  <span className={isDark(activeSwatch.color) ? 'lightText' : 'darkText'}>{activeSwatch.name}</span>
                </Swatch>
              ) : (
                <Swatch color="#FFFFFF" onClick={this.onEraserClick}>
                  <span className="darkText">Eraser</span>
                </Swatch>
              )
            }
            { this.state.swatches.map( (swatch, index) => {
              return (
                <Swatch key={index} color={swatch.color} onClick={() => this.onColorClick(swatch) }>
                  <span className={isDark(swatch.color) ? 'lightText' : 'darkText'}>{swatch.name}</span>
                </Swatch>
              )
            } )}
            <Swatch color="#FFFFFF" onClick={this.onEraserClick}>
              <span className="darkText">Eraser</span>
            </Swatch>
          </div>

        </div>
        <div>
          'Z' to undo, 'X' to redo
        </div>
      </div>
    )
  }
}

export default App
