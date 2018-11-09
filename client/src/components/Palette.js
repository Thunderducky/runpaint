import React from 'react'
import Swatch from './Swatch'
import * as Icons from './Icons'
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
    activeTool: 'dotpen',
    palette: []
  }
  componentDidMount(){
    const {subscribe: SUB } = this.props.PUBSUB
    SUB('context.canvas.update.style',({style}) => {
      this.setState({activeColor: style})
    })

    SUB('context.canvas.update.tool',({tool}) => {
      this.setState({activeTool: tool})
    })

    const { palette } = this.props.context.request()
    this.setState({palette})
  }

  renderToolIcon = () => {
    switch(this.state.activeTool){
    case 'dotpen':
      return (<Icons.Pen />)
    case 'eraser':
      return (<Icons.Eraser />)
    case 'smartFill':
      return (<Icons.Tint />)
    default:
      throw new Error('render tool icon isn\'t set')
    }
  }

  eraserClick(){
    this.setState({activeColor: ""})
    this.props.PUBSUB.publish('context.canvas.set.tool', {tool: 'eraser'})
  }

  render(){
    const wrapClickColor = (color) => {
      const clickHandler = () => {
        if(this.state.activeTool === 'eraser'){
          this.props.PUBSUB.publish('context.canvas.set.tool', {tool: 'dotpen'})
        }
        this.props.PUBSUB.publish('context.canvas.set.style', {style: color})
      }
      return clickHandler
    }

    return (
      <div>
        {/* I am being to clever here with the syntax, dumb it up */}
        <div style={{border: 'white solid 1px'}}>
          {/* TODO: We should make this a seperate thing */}
          <Swatch color={this.state.activeColor}>
            {this.renderToolIcon()}
          </Swatch>
        </div>
        <Swatch onClick={() => this.eraserClick()}>
          Eraser
        </Swatch>
        {this.state.palette.map(
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
