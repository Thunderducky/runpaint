import React, { Component } from 'react'
import Swatch from './components/Swatch'
import Canvas from './components/Canvas'
import AddSwatchForm from './components/AddSwatchForm'
import MousePositionTracker from './components/MousePositionTracker'
import ExportButton from './components/ExportButton'
import SWATCHES from './_data/swatches'
import colorHelper from './modules/colorHelper'
import { PUBSUB } from './modules/pubsub'

// App.js is about binding together all the pieces, not doing much rendering

const isDark = color => {
  if(color[0] === '#'){
    color = color.slice(1)
  }
  return colorHelper.isDark(color)
}

const genId = () => {
  return genId._id++
}
genId._id = 0

class App extends Component {
  constructor(){
    super()
    // add a unique id to it
    const swatches = SWATCHES.map(s => {s.id = genId(); return s})
    this.state = {
      eraserActive: false,
      activeSwatch: swatches[0],
      swatches: swatches
    }
    // TODO: Remove this and put it in it's own special piece
    document.onkeydown = (event) => {
      if(event.key === 'z'){
        PUBSUB.publish('canvas.history.undo', {})
      }
      if(event.key === 'x'){
        PUBSUB.publish('canvas.history.redo', {})
      }
    }
  }

  onColorClick = swatch => {
    this.setState({activeSwatch: swatch, eraserActive: false})
  }
  onEraserClick = () =>{
    this.setState({eraserActive: true})
  }
  // This can be moved
  addSwatch(name, color){
    const newSwatch = { name, color, id: genId() }
    this.setState({swatches: [...this.state.swatches, newSwatch]})
  }

  // This can be moved
  confirmDelete(id, event){
    event.stopPropagation()
    const swatch = this.state.swatches.filter(s => s.id === id)[0]
    if(window.confirm(`Remove ${swatch.name} ?`)){
      this.setState({
        eraserActive: swatch.id === this.state.activeSwatch.id,
        swatches: this.state.swatches.filter(s => s.id !== id)
      })
    }
    return false
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
              // TODO: Put this in our REDUX state
              color={this.state.activeSwatch.color}
              eraserActive={this.state.eraserActive}
              width={32}
              height={32}
            />
            <div className="spreadRow">
              <MousePositionTracker PUBSUB={PUBSUB} />
            </div>
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
                  <button style={{float:'right'}} onClick={event => this.confirmDelete(swatch.id, event)}>X</button>
                </Swatch>
              )
            } )}
            <Swatch color="#FFFFFF" onClick={this.onEraserClick}>
              <span className="darkText">Eraser</span>
            </Swatch>
            <AddSwatchForm submitFn={(name, color) => this.addSwatch(name, color)}/>
          </div>

        </div>
        <div>
          &#39;Z&#39; to undo, &#39;X&#39; to redo
        </div>
        <div style={{display:'flex', justifyContent: 'space-between'}}>
          <div>
            <ExportButton PUBSUB={PUBSUB}/>
          </div>
        </div>
      </div>
    )
  }
}

export default App
