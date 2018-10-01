import React, { Component } from 'react'
import Swatch from './components/Swatch'
import Canvas from './components/Canvas'
import SWATCHES from './_data/swatches'
import colorHelper from './modules/colorHelper'

const isDark = color => {
  if(color[0] === '#'){
    color = color.slice(1)
  }
  return colorHelper.isDark(color);
}

// Move into a mouse helper
// NOTE: This includes the boundaries
const getRelativeMousePoint = event => {
  const rect = event.target.getBoundingClientRect();
  const point = {
    x: event.clientX - rect.x,
    y: event.clientY - rect.y
  };
  return point;
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
  }
  onColorClick = (swatch) => {
    this.setState({activeSwatch: swatch})
  }

  componentDidMount(){
    // const ctx = this.canvas.getContext('2d')
    // ctx.fillStyle='blue'
    // ctx.fillRect(2,2, 100, 100)
    // add all of our click handlers and listeners
    // though in reality we might move these around later
  }

  // CANVAS COMPONENT
  // onCanvasMouseDown = event => {
  //   const point = getRelativeMousePoint(event);
  //   this.setState({canvasMouseDown:true})
  //   console.log("DOWN", point);
  // }
  // onCanvasMouseUp = event => {
  //   const point = getRelativeMousePoint(event);
  //   this.setState({canvasMouseDown:false})
  //   console.log("UP", point);
  // }
  //
  // onCanvasMouseMove = event => {
  //   const point = getRelativeMousePoint(event);
  //   if(this.state.canvasMouseDown){
  //     console.log("MOVE", point);
  //   }
  // }
  render() {
    const { activeSwatch } = this.state
    return (
      <div className="spreadRow">

        <div> {/* main */}
          <h1 className="terminal">paint.exe</h1>
          <Canvas
            // onMouseDown={this.onCanvasMouseDown}
            // onMouseUp={this.onCanvasMouseUp}
            // onMouseMove={this.onCanvasMouseMove}
            ref={c => {this.canvas = c} }
            zoom={20}
            color={this.state.activeSwatch.color}
            width={32}
            height={32}
          />
          <div className="spreadRow"></div>
        </div>
        <div> {/* sidebar TODO: return to component */}
          <Swatch color={activeSwatch.color}>
            <span className={isDark(activeSwatch.color) ? 'lightText' : 'darkText'}>{activeSwatch.name}</span>
          </Swatch>
          { this.state.swatches.map( (swatch, index) => {
            return (
              <Swatch key={index} color={swatch.color} onClick={() => this.onColorClick(swatch) }>
                <span className={isDark(swatch.color) ? 'lightText' : 'darkText'}>{swatch.name}</span>
              </Swatch>
            )
          } )}
        </div>

      </div>
    )
  }
}

export default App
