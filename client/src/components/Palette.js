import React from 'react'
import Swatch from './Swatch'
// Let's finish this up and then we'll go on to the 'tool bar' aspect of things

// convenience function for making colors
const c = (colorCode, name) => ({
  color: colorCode,
  name
})

const colors = [
  c('#FFFFFF', 'white'),
  c('#FF0000', 'red'),
  c('#00FF00', 'green'),
  c('#0000FF', 'blue'),
  c('#000000', 'black')
]

class Palette extends React.Component{
  // HELPER THAT MAKES THE CORRECT CLICK HANDLER BASED OFF OF COLOR
  state = {
    activeColor: colors[0].color,
    activeTool: 'dotpen'
  }
  componentDidMount(){
    this.props.PUBSUB.subscribe('context.canvas.update.style',({style}) => {
      this.setState({activeColor: style})
    })

    this.props.PUBSUB.subscribe('context.canvas.update.tool',({tool}) => {
      this.setState({activeTool: tool})
    })
  }
  render(){
    const wrapClickColor = (color) => {
      const clickHandler = () => {
        this.props.PUBSUB.publish('context.canvas.set.style', {style: color})
      }
      return clickHandler
    }

    return (
      <div>
        {/* I am being to clever here with the syntax, dumb it up */}
        <div style={{border: 'white solid 1px'}}>
          <Swatch color={this.state.activeColor}>
            {this.state.activeTool}
          </Swatch>
        </div>
        {colors.map(
          ({color, name}, index) => (
            <Swatch key={index} color={color} onClick={wrapClickColor(color)}>
              {name}
            </Swatch>
          )
        )}
      </div>
    )
  }
}

export default Palette
