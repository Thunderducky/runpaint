import React, { Component } from 'react'
import Swatch from './components/Swatch'
import Canvas from './components/Canvas'
import SWATCHES from './_data/swatches'
import colorHelper from './modules/colorHelper'

const isDark = color => {
  if(color[0] === '#'){
    color = color.slice(1)
  }
  return colorHelper.isDark(color)
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
  onColorClick = swatch => {
    this.setState({activeSwatch: swatch})
  }

  render() {
    const { activeSwatch } = this.state
    return (
      <div className="spreadRow">

        <div> {/* main */}
          <h1 className="terminal">paint.exe</h1>
          <Canvas
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
